import express from 'express';
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = process.env.DATA_DIR || path.resolve('data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'drawer.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS locations (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, parent_id TEXT REFERENCES locations(id),
 kind TEXT NOT NULL CHECK(kind IN ('cabinet','drawer','shelf','box','other'))
);
CREATE TABLE IF NOT EXISTS cables (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, connector_a TEXT NOT NULL,
 connector_b TEXT NOT NULL, color TEXT NOT NULL DEFAULT '',
 length_cm INTEGER CHECK(length_cm IS NULL OR length_cm > 0),
 notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS cable_units (
 id TEXT PRIMARY KEY, cable_id TEXT NOT NULL REFERENCES cables(id) ON DELETE CASCADE,
 status TEXT NOT NULL CHECK(status IN ('stored','in_use','loaned','missing')),
 location_id TEXT REFERENCES locations(id), usage_place TEXT NOT NULL DEFAULT '',
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cables_ends ON cables(connector_a,connector_b);
CREATE INDEX IF NOT EXISTS idx_units_cable ON cable_units(cable_id);
`);
app.use(express.json({limit:'64kb'}));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
const route = (fn) => (req,res) => {try {fn(req,res)} catch(e) {res.status(400).json({error:e.message})}};
const required = (value,name) => {if(typeof value!=='string'||!value.trim()||value.length>160) throw Error('Invalid '+name);return value.trim()};
const optional = value => typeof value==='string'?value.trim().slice(0,2000):'';
const validStatus = s => ['stored','in_use','loaned','missing'].includes(s);
app.get('/api/locations',route((req,res)=>res.json(db.prepare('SELECT * FROM locations ORDER BY name').all())));
app.post('/api/locations',route((req,res)=>{
 const {name,kind,parent_id=null}=req.body;
 if(!['cabinet','drawer','shelf','box','other'].includes(kind)) throw Error('Invalid location kind');
 if(parent_id&&!db.prepare('SELECT id FROM locations WHERE id=?').get(parent_id)) throw Error('Unknown parent');
 const id=randomUUID();db.prepare('INSERT INTO locations(id,name,parent_id,kind) VALUES(?,?,?,?)').run(id,required(name,'name'),parent_id,kind);res.status(201).json({id});
}));
app.get('/api/cables',route((req,res)=>{
 const q=optional(req.query.q).toLowerCase(),filter=optional(req.query.status);
 let rows=db.prepare(`SELECT c.*,count(u.id) total,
 sum(CASE WHEN u.status='stored' THEN 1 ELSE 0 END) stored,
 sum(CASE WHEN u.status='in_use' THEN 1 ELSE 0 END) in_use,
 sum(CASE WHEN u.status='loaned' THEN 1 ELSE 0 END) loaned,
 sum(CASE WHEN u.status='missing' THEN 1 ELSE 0 END) missing
 FROM cables c LEFT JOIN cable_units u ON u.cable_id=c.id GROUP BY c.id ORDER BY c.created_at DESC`).all();
 if(q)rows=rows.filter(c=>[c.name,c.connector_a,c.connector_b,c.color,c.notes].join(' ').toLowerCase().includes(q));
 if(validStatus(filter))rows=rows.filter(c=>c[filter]>0);
 res.json(rows);
}));
app.get('/api/cables/:id',route((req,res)=>{
 const cable=db.prepare('SELECT * FROM cables WHERE id=?').get(req.params.id);
 if(!cable)return res.status(404).json({error:'Not found'});
 res.json({...cable,units:db.prepare(`SELECT u.*,l.name location_name FROM cable_units u LEFT JOIN locations l ON l.id=u.location_id WHERE cable_id=? ORDER BY u.updated_at DESC`).all(cable.id)});
}));
app.post('/api/cables',route((req,res)=>{
 const {name,connector_a,connector_b,color='',length_cm=null,notes='',quantity=1,location_id=null,status='stored',usage_place=''}=req.body;
 if(!Number.isInteger(quantity)||quantity<1||quantity>1000)throw Error('Quantity must be 1–1000');
 if(length_cm!==null&&(!Number.isInteger(length_cm)||length_cm<1))throw Error('Invalid length');
 if(!validStatus(status))throw Error('Invalid status');
 if(location_id&&!db.prepare('SELECT id FROM locations WHERE id=?').get(location_id))throw Error('Unknown location');
 const id=randomUUID(), title=required(name,'name'),a=required(connector_a,'connector_a'),b=required(connector_b,'connector_b');
 db.transaction(()=>{
 db.prepare('INSERT INTO cables(id,name,connector_a,connector_b,color,length_cm,notes) VALUES(?,?,?,?,?,?,?)').run(id,title,a,b,optional(color),length_cm,optional(notes));
 const insert=db.prepare('INSERT INTO cable_units(id,cable_id,status,location_id,usage_place) VALUES(?,?,?,?,?)');
 for(let i=0;i<quantity;i++)insert.run(randomUUID(),id,status,status==='stored'?location_id:null,status==='stored'?'':optional(usage_place));
 })();
 res.status(201).json({id});
}));
app.patch('/api/units/:id',route((req,res)=>{
 const existing=db.prepare('SELECT * FROM cable_units WHERE id=?').get(req.params.id);
 if(!existing)return res.status(404).json({error:'Not found'});
 const status=req.body.status??existing.status, location_id=req.body.location_id===undefined?existing.location_id:req.body.location_id;
 if(!validStatus(status))throw Error('Invalid status');
 if(location_id&&!db.prepare('SELECT id FROM locations WHERE id=?').get(location_id))throw Error('Unknown location');
 db.prepare("UPDATE cable_units SET status=?,location_id=?,usage_place=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(status,status==='stored'?location_id:null,status==='stored'?'':optional(req.body.usage_place??existing.usage_place),existing.id);
 res.json({ok:true});
}));
app.post('/api/cables/:id/units',route((req,res)=>{
 if(!db.prepare('SELECT id FROM cables WHERE id=?').get(req.params.id))return res.status(404).json({error:'Not found'});
 const {location_id=null}=req.body;if(location_id&&!db.prepare('SELECT id FROM locations WHERE id=?').get(location_id))throw Error('Unknown location');
 const id=randomUUID();db.prepare("INSERT INTO cable_units(id,cable_id,status,location_id) VALUES(?,?,'stored',?)").run(id,req.params.id,location_id);res.status(201).json({id});
}));
app.use('/api',(req,res)=>res.status(404).json({error:'Unknown API route'}));
app.listen(port,'0.0.0.0',()=>console.log('AGF Drawer listening on '+port));

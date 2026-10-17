import React, { useState } from 'react';
import {
  Layers,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { CableItem } from '../types';
import { StatusDot } from '../components/StatusDot';

interface InventoryViewProps {
  cables: CableItem[];
  onSelectCable: (cable: CableItem) => void;
  onOpenAddModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  cables,
  onSelectCable,
  onOpenAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = cables.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.connector_a.toLowerCase().includes(q) ||
      c.connector_b.toLowerCase().includes(q) ||
      (c.reference_code && c.reference_code.toLowerCase().includes(q));

    const matchesCat =
      selectedCategory === 'all' || (c.category || 'Kabel') === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Name,ConnectorA,ConnectorB,Color,LengthCm,Total,Stored,InUse,Missing,Location\n';
    const rows = filtered
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.connector_a}","${c.connector_b}","${c.color || ''}",${c.length_cm || ''},${c.total},${c.stored},${c.inUse},${c.missing},"${c.storageLocationName || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agf-drawer-inventar-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#0057FF]" />
            Gesamtinventar
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Vollständige Bestandsliste mit Statusverteilung und Exportfunktion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-200 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Exportieren</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            + Kabel erfassen
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nach Typ, Stecker, ID oder Referenz suchen..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none"
        >
          <option value="all">Alle Kategorien</option>
          <option value="USB">USB & Daten</option>
          <option value="Video">Video & Monitor</option>
          <option value="Netzwerk">Netzwerk</option>
          <option value="Strom">Stromversorgung</option>
          <option value="Audio">Audio</option>
        </select>
      </div>

      {/* Full Tabular Inventory */}
      <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/70 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Ref-ID</th>
                <th className="py-3 px-4">Kabeltyp / Bezeichnung</th>
                <th className="py-3 px-4">Stecker A ↔ B</th>
                <th className="py-3 px-4">Farbe & Länge</th>
                <th className="py-3 px-4">Lagerort</th>
                <th className="py-3 px-4">Statusverteilung</th>
                <th className="py-3 px-4 text-right">Gesamt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filtered.map((cable, idx) => (
                <tr
                  key={cable.id}
                  onClick={() => onSelectCable(cable)}
                  className="hover:bg-neutral-900/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-neutral-400">
                    {cable.reference_code || `KBL-${(idx + 1).toString().padStart(4, '0')}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {cable.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal">
                      {cable.manufacturer || cable.cable_standard || cable.category || 'Kabel'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-300">
                    {cable.connector_a} ↔ {cable.connector_b}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    <div>{cable.color || 'Schwarz'}</div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {cable.length_cm ? `${(cable.length_cm / 100).toFixed(1)} m` : '-'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-mono">
                    {cable.storageLocationName || 'Lager'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <StatusDot status="stored" count={cable.stored} label="Lager" />
                      <StatusDot status="in_use" count={cable.inUse} label="In Nutzung" />
                      {cable.missing > 0 && (
                        <StatusDot status="missing" count={cable.missing} label="Vermisst" />
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                    {cable.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

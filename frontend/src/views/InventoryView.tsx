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
  isLightMode?: boolean;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  cables,
  onSelectCable,
  onOpenAddModal,
  isLightMode = false,
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
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2.5 ${
            isLightMode ? 'text-neutral-900' : 'text-white'
          }`}>
            <Layers className="w-6 h-6 text-[#0057FF]" />
            Gesamtinventar
          </h1>
          <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Vollständige Bestandsliste mit Statusverteilung und Exportfunktion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
              isLightMode
                ? 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-xs'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white'
            }`}
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
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isLightMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nach Typ, Stecker, ID oder Referenz suchen..."
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs md:text-sm focus:outline-none focus:border-[#0057FF] ${
              isLightMode
                ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 shadow-xs'
                : 'bg-neutral-900/90 border-neutral-800 text-white placeholder-neutral-500'
            }`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-3 py-2.5 border rounded-xl text-xs focus:outline-none ${
            isLightMode
              ? 'bg-white border-neutral-200 text-neutral-800 shadow-xs'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300'
          }`}
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
      <div className={`rounded-3xl border overflow-hidden ${
        isLightMode ? 'bg-white border-neutral-200 shadow-sm' : 'bg-neutral-950 border-neutral-800/80 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-mono uppercase text-[11px] ${
              isLightMode ? 'bg-neutral-50/80 border-neutral-200 text-neutral-600' : 'bg-neutral-900/70 border-neutral-800 text-neutral-400'
            }`}>
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
            <tbody className={`divide-y ${isLightMode ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
              {filtered.map((cable, idx) => (
                <tr
                  key={cable.id}
                  onClick={() => onSelectCable(cable)}
                  className={`cursor-pointer transition-colors group ${
                    isLightMode ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/50'
                  }`}
                >
                  <td className={`py-3.5 px-4 font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {cable.reference_code || `KBL-${(idx + 1).toString().padStart(4, '0')}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className={`font-semibold transition-colors ${
                      isLightMode ? 'text-neutral-900 group-hover:text-[#0057FF]' : 'text-white group-hover:text-blue-400'
                    }`}>
                      {cable.name}
                    </div>
                    <div className={`text-[11px] font-normal ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {cable.manufacturer || cable.cable_standard || cable.category || 'Kabel'}
                    </div>
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                    {cable.connector_a} ↔ {cable.connector_b}
                  </td>
                  <td className={`py-3.5 px-4 ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                    <div>{cable.color || 'Schwarz'}</div>
                    <div className={`text-[11px] font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {cable.length_cm ? `${(cable.length_cm / 100).toFixed(1)} m` : '-'}
                    </div>
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
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
                  <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${
                    isLightMode ? 'text-neutral-900' : 'text-white'
                  }`}>
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

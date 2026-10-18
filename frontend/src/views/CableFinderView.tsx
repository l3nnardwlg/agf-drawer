import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { CableItem } from '../types';
import { CableSchematic } from '../components/CableSchematic';
import { StatusDot } from '../components/StatusDot';

interface CableFinderViewProps {
  cables: CableItem[];
  onSelectCable: (cable: CableItem) => void;
  onOpenAddModal: () => void;
  initialSearchQuery?: string;
  isLightMode?: boolean;
}

export const CableFinderView: React.FC<CableFinderViewProps> = ({
  cables,
  onSelectCable,
  onOpenAddModal,
  initialSearchQuery = '',
  isLightMode = false,
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedConnector, setSelectedConnector] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [lengthFilter, setLengthFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  // Symmetrical search logic: connector_a <-> connector_b order-independent
  const filteredCables = useMemo(() => {
    const q = search.toLowerCase().trim();

    return cables.filter((c) => {
      // Available only filter
      if (onlyAvailable && c.stored <= 0) return false;

      // Color filter
      if (selectedColor !== 'all' && (!c.color || !c.color.toLowerCase().includes(selectedColor.toLowerCase()))) {
        return false;
      }

      // Connector filter
      if (selectedConnector !== 'all') {
        const conn = selectedConnector.toLowerCase();
        const matchesA = c.connector_a.toLowerCase().includes(conn);
        const matchesB = c.connector_b.toLowerCase().includes(conn);
        if (!matchesA && !matchesB) return false;
      }

      // Length filter
      if (lengthFilter !== 'all') {
        const len = c.length_cm || 0;
        if (lengthFilter === 'short' && len > 100) return false;
        if (lengthFilter === 'medium' && (len <= 100 || len > 200)) return false;
        if (lengthFilter === 'long' && len <= 200) return false;
      }

      // Free text search with symmetrical pair matching
      if (!q) return true;

      const nameMatch = c.name.toLowerCase().includes(q);
      const locMatch = (c.storageLocationName || '').toLowerCase().includes(q);
      const tagMatch = (c.tags || []).some((t) => t.toLowerCase().includes(q));
      const a = c.connector_a.toLowerCase();
      const b = c.connector_b.toLowerCase();

      // Check standard or symmetrical match e.g. "usb-c hdmi"
      const directMatch = a.includes(q) || b.includes(q);
      const pairMatch = `${a} ${b}`.includes(q) || `${b} ${a}`.includes(q);

      return nameMatch || locMatch || tagMatch || directMatch || pairMatch;
    });
  }, [cables, search, onlyAvailable, selectedColor, selectedConnector, lengthFilter]);

  const uniqueConnectors = useMemo(() => {
    const set = new Set<string>();
    cables.forEach((c) => {
      set.add(c.connector_a);
      set.add(c.connector_b);
    });
    return Array.from(set).sort();
  }, [cables]);

  const uniqueColors = useMemo(() => {
    const set = new Set<string>();
    cables.forEach((c) => {
      if (c.color) set.add(c.color);
    });
    return Array.from(set).sort();
  }, [cables]);

  return (
    <div className={`p-4 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            Kabel-Finder
          </h1>
          <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Finde das passende Kabel anhand von Steckern, Farbe, Länge oder Lagerort.
          </p>
        </div>

        {/* View Mode Switcher & Add Cable Action */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center rounded-xl p-1 border transition-colors ${
              isLightMode ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'cards'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-600 hover:text-neutral-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Kartenansicht"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Karten</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-600 hover:text-neutral-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Tabellenansicht"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabelle</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/15 transition-all"
          >
            + Neues Kabel
          </button>
        </div>
      </div>

      {/* Symmetrical Search & Quick Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Steckern (z.B. USB-C ↔ USB-A), Farbe, Länge oder Tag..."
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs md:text-sm border transition-all focus:outline-none focus:border-[#0057FF] ${
                isLightMode
                  ? 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400'
                  : 'bg-neutral-900/90 border-neutral-800 text-white placeholder-neutral-500'
              }`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute right-3 top-3 ${
                  isLightMode ? 'text-neutral-400 hover:text-neutral-800' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Available only toggle */}
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
              onlyAvailable
                ? isLightMode
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                : isLightMode
                ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Nur sofort verfügbar</span>
          </button>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Connector Select */}
          <select
            value={selectedConnector}
            onChange={(e) => setSelectedConnector(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border focus:outline-none ${
              isLightMode
                ? 'bg-white border-neutral-300 text-neutral-800'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}
          >
            <option value="all">Alle Anschlüsse</option>
            {uniqueConnectors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Color Select */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border focus:outline-none ${
              isLightMode
                ? 'bg-white border-neutral-300 text-neutral-800'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}
          >
            <option value="all">Alle Farben</option>
            {uniqueColors.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          {/* Length Pills */}
          <div
            className={`flex items-center gap-1 border p-0.5 rounded-lg ${
              isLightMode ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <button
              onClick={() => setLengthFilter('all')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                lengthFilter === 'all'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-600'
                  : 'text-neutral-400'
              }`}
            >
              Alle Längen
            </button>
            <button
              onClick={() => setLengthFilter('short')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                lengthFilter === 'short'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-600'
                  : 'text-neutral-400'
              }`}
            >
              ≤ 1 m
            </button>
            <button
              onClick={() => setLengthFilter('medium')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                lengthFilter === 'medium'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-600'
                  : 'text-neutral-400'
              }`}
            >
              1 - 2 m
            </button>
            <button
              onClick={() => setLengthFilter('long')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                lengthFilter === 'long'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-600'
                  : 'text-neutral-400'
              }`}
            >
              &gt; 2 m
            </button>
          </div>

          {/* Results count */}
          <span className={`text-xs font-mono ml-auto ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {filteredCables.length} {filteredCables.length === 1 ? 'Kabel' : 'Kabel'}
          </span>
        </div>
      </div>

      {/* Symmetrical Search Info Hint Banner */}
      <div
        className={`px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs ${
          isLightMode
            ? 'bg-blue-50 border-blue-200 text-blue-900'
            : 'bg-neutral-950 border-neutral-800/80 text-neutral-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#0057FF] shrink-0" />
          <span>
            <strong>Symmetrische Suche:</strong> Die Reihenfolge der Stecker spielt keine Rolle. "USB-C auf USB-A" findet auch "USB-A auf USB-C".
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] opacity-80">
          Symmetrie aktiv
        </span>
      </div>

      {/* Content Area: Cards or Table */}
      {filteredCables.length === 0 ? (
        <div
          className={`py-20 text-center rounded-2xl border space-y-3 ${
            isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-900'
          }`}
        >
          <div className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-500'}`}>
            Keine Kabel entsprechen deinen Kriterien.
          </div>
          <button
            onClick={() => {
              setSearch('');
              setSelectedConnector('all');
              setSelectedColor('all');
              setOnlyAvailable(false);
              setLengthFilter('all');
            }}
            className="text-xs text-[#0057FF] hover:underline font-semibold"
          >
            Alle Filter zurücksetzen
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCables.map((cable) => (
            <div
              key={cable.id}
              onClick={() => onSelectCable(cable)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-4 ${
                isLightMode
                  ? 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                  : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40 shadow-sm'
              }`}
            >
              {/* Top metadata */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-mono uppercase ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {cable.category || 'Kabel'}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      isLightMode
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-300'
                    }`}
                  >
                    {cable.storageLocationName || 'Lager'}
                  </span>
                </div>
                <h3
                  className={`text-base font-semibold transition-colors ${
                    isLightMode ? 'text-neutral-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'
                  }`}
                >
                  {cable.name}
                </h3>
                <div className={`text-xs mt-1 flex items-center gap-2 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  <span>{cable.color || 'Schwarz'}</span>
                  {cable.length_cm && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{(cable.length_cm / 100).toFixed(1)} m</span>
                    </>
                  )}
                  {cable.cable_standard && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">{cable.cable_standard}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Cable Schematic Illustration */}
              <CableSchematic
                connectorA={cable.connector_a}
                connectorB={cable.connector_b}
                color={cable.color}
                lengthCm={cable.length_cm}
                size="md"
                isLightMode={isLightMode}
              />

              {/* Status and count summary */}
              <div
                className={`pt-3 border-t flex items-center justify-between text-xs ${
                  isLightMode ? 'border-neutral-100' : 'border-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <StatusDot status="stored" count={cable.stored} label="Lager" />
                  <StatusDot status="in_use" count={cable.inUse} label="In Nutzung" />
                  {cable.missing > 0 && (
                    <StatusDot status="missing" count={cable.missing} label="Vermisst" />
                  )}
                </div>
                <div
                  className={`flex items-center gap-1 transition-colors ${
                    isLightMode ? 'text-neutral-400 group-hover:text-neutral-900' : 'text-neutral-400 group-hover:text-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div
          className={`rounded-2xl border overflow-hidden ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`border-b font-mono uppercase text-[11px] ${
                  isLightMode
                    ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Kabeltyp / Name</th>
                  <th className="py-3 px-4">Stecker A ↔ B</th>
                  <th className="py-3 px-4">Farbe & Länge</th>
                  <th className="py-3 px-4">Lagerort</th>
                  <th className="py-3 px-4">Bestand</th>
                  <th className="py-3 px-4 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isLightMode ? 'divide-neutral-100' : 'divide-neutral-900'
                }`}
              >
                {filteredCables.map((cable) => (
                  <tr
                    key={cable.id}
                    onClick={() => onSelectCable(cable)}
                    className={`cursor-pointer transition-colors group ${
                      isLightMode ? 'hover:bg-neutral-50/80' : 'hover:bg-neutral-900/50'
                    }`}
                  >
                    <td
                      className={`py-3.5 px-4 font-semibold ${
                        isLightMode
                          ? 'text-neutral-900 group-hover:text-blue-600'
                          : 'text-white group-hover:text-blue-400'
                      }`}
                    >
                      <div>{cable.name}</div>
                      <div className={`text-[11px] font-normal ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {cable.manufacturer || cable.cable_standard || 'Standard'}
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            isLightMode
                              ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          {cable.connector_a}
                        </span>
                        <span className={isLightMode ? 'text-neutral-400' : 'text-neutral-500'}>↔</span>
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            isLightMode
                              ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                              : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          {cable.connector_b}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      <div>{cable.color || 'Schwarz'}</div>
                      <div className={`text-[11px] font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {cable.length_cm ? `${(cable.length_cm / 100).toFixed(1)} m` : '-'}
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono text-xs ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      {cable.storageLocationName || 'Lagerort'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <StatusDot status="stored" count={cable.stored} label="Lager" />
                        <StatusDot status="in_use" count={cable.inUse} label="In Nutzung" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                          isLightMode
                            ? 'border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                            : 'border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900'
                        }`}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

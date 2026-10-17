import React, { useState } from 'react';
import {
  Archive,
  Layers,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Box,
  Cable,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { StorageLocation, CableItem } from '../types';

interface StorageViewProps {
  storageLocations: StorageLocation[];
  cables: CableItem[];
  onSelectCable: (cable: CableItem) => void;
  onAddLocation?: (name: string, type: StorageLocation['type'], parentId?: string) => void;
}

export const StorageView: React.FC<StorageViewProps> = ({
  storageLocations,
  cables,
  onSelectCable,
  onAddLocation,
}) => {
  const [viewType, setViewType] = useState<'cabinet' | 'tree'>('cabinet');
  const [selectedCabinetId, setSelectedCabinetId] = useState<string>(
    storageLocations[0]?.id || ''
  );
  const [selectedDrawerId, setSelectedDrawerId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    [storageLocations[0]?.id || '']: true,
  });

  const cabinets = storageLocations.filter(
    (loc) => loc.type === 'CABINET' || loc.type === 'ROOM' || !loc.parentId
  );

  const activeCabinet =
    storageLocations.find((l) => l.id === selectedCabinetId) || cabinets[0];

  // Drawers / child locations for active cabinet
  const cabinetDrawers = storageLocations.filter(
    (loc) => loc.parentId === activeCabinet?.id || (activeCabinet?.children && activeCabinet.children.some(c => c.id === loc.id))
  );

  // Cables inside selected drawer or cabinet
  const displayedCables = cables.filter((c) => {
    if (selectedDrawerId) {
      const drawer = storageLocations.find((l) => l.id === selectedDrawerId);
      return drawer && c.storageLocationName?.includes(drawer.name);
    }
    return activeCabinet && c.storageLocationName?.includes(activeCabinet.name);
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Lagerorte & Schrankverwaltung
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Verwalte Schränke, Schubladen und Fächer für eine fehlerfreie Einsortierung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setViewType('cabinet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewType === 'cabinet'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Schrankansicht (Visuell)
            </button>
            <button
              onClick={() => setViewType('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewType === 'tree'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Baumansicht (Hierarchie)
            </button>
          </div>
        </div>
      </div>

      {viewType === 'cabinet' ? (
        /* Visual Cabinet View (Figma: Lagerorte – Schrankansicht) */
        <div className="space-y-6">
          {/* Cabinet Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {cabinets.map((cab) => (
              <button
                key={cab.id}
                onClick={() => {
                  setSelectedCabinetId(cab.id);
                  setSelectedDrawerId(null);
                }}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  selectedCabinetId === cab.id
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>{cab.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  selectedCabinetId === cab.id ? 'bg-neutral-200 text-black' : 'bg-neutral-900 text-neutral-400'
                }`}>
                  {cab.unitCount || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Cabinet Drawer Rack (Left 2 cols) */}
            <div className="lg:col-span-2 rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">{activeCabinet?.name}</h3>
                  <p className="text-xs text-neutral-400">{activeCabinet?.description || 'Hauptschrank'}</p>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  {cabinetDrawers.length > 0 ? `${cabinetDrawers.length} Ebenen / Schubladen` : '1 Ebene'}
                </span>
              </div>

              {/* Rendered Cabinet Drawers / Shelves */}
              <div className="space-y-3">
                {(cabinetDrawers.length > 0 ? cabinetDrawers : [activeCabinet]).map((drawer, idx) => {
                  const isSelected = selectedDrawerId === drawer.id;
                  const estimatedCapacity = 30;
                  const currentCount = drawer.unitCount || 8 + (idx * 4);
                  const percentage = Math.min(100, Math.round((currentCount / estimatedCapacity) * 100));

                  return (
                    <div
                      key={drawer.id}
                      onClick={() => setSelectedDrawerId(isSelected ? null : drawer.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                        isSelected
                          ? 'bg-neutral-900/90 border-[#0057FF] shadow-lg shadow-blue-500/10'
                          : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/70 hover:border-neutral-700'
                      }`}
                    >
                      {/* Drawer Handle (metallic aesthetic) */}
                      <div className="w-16 h-1.5 mx-auto bg-neutral-700 rounded-full mb-3 shadow-inner group-hover:bg-neutral-500 transition-colors" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${
                            isSelected ? 'bg-blue-950/60 border-blue-800 text-blue-400' : 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
                          }`}>
                            <Box className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-2">
                              {drawer.name}
                              <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.2 rounded bg-neutral-800">
                                {drawer.type}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">
                              {drawer.description || 'Standardaufbewahrung'}
                            </div>
                          </div>
                        </div>

                        {/* Capacity gauge */}
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">
                            {currentCount} <span className="text-[10px] font-normal text-neutral-400">/ {estimatedCapacity} Kabel</span>
                          </div>
                          <div className="w-24 h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                percentage > 85 ? 'bg-amber-400' : 'bg-[#0057FF]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contents Sidebar (Right 1 col) */}
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-900 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Inhalt {selectedDrawerId ? 'dieser Schublade' : 'im Schrank'}
                  </h3>
                  <span className="text-xs font-mono text-white">
                    {displayedCables.length} Kabeltypen
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {displayedCables.length === 0 ? (
                    <div className="py-12 text-center text-xs text-neutral-500">
                      Keine Kabel in diesem Lagerort zugewiesen.
                    </div>
                  ) : (
                    displayedCables.map((cable) => (
                      <div
                        key={cable.id}
                        onClick={() => onSelectCable(cable)}
                        className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:bg-neutral-900 hover:border-neutral-700 cursor-pointer transition-all group"
                      >
                        <div className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">
                          {cable.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center justify-between mt-1">
                          <span>{cable.connector_a} ↔ {cable.connector_b}</span>
                          <span className="font-mono text-neutral-300 font-semibold">{cable.stored} verfügbar</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900 text-xs text-neutral-400 text-center">
                Wähle eine Schublade aus, um den Inhalt zu filtern.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hierarchical Tree View (Figma: Lagerorte – Baumansicht) */
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Hierarchische Lagerstruktur
          </div>

          <div className="space-y-2">
            {storageLocations.map((loc) => {
              const isExpanded = expandedNodes[loc.id];
              return (
                <div key={loc.id} className="border border-neutral-800/60 rounded-xl bg-neutral-900/30 overflow-hidden">
                  <div
                    onClick={() => toggleNode(loc.id)}
                    className="p-3 flex items-center justify-between hover:bg-neutral-900/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      )}
                      <Archive className="w-4 h-4 text-[#0057FF]" />
                      <span className="text-xs font-semibold text-white">{loc.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {loc.type}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-300">
                      {loc.unitCount || 0} Kabel
                    </span>
                  </div>

                  {isExpanded && loc.description && (
                    <div className="px-10 pb-3 text-xs text-neutral-400">
                      {loc.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

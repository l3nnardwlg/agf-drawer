import React, { useState } from 'react';
import {
  Archive,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Box,
  HardDrive
} from 'lucide-react';
import { StorageLocation, CableItem } from '../types';

interface StorageViewProps {
  storageLocations: StorageLocation[];
  cables: CableItem[];
  onSelectCable: (cable: CableItem) => void;
  onAddLocation?: (name: string, type: StorageLocation['type'], parentId?: string) => void;
  isLightMode?: boolean;
}

export const StorageView: React.FC<StorageViewProps> = ({
  storageLocations,
  cables,
  onSelectCable,
  onAddLocation,
  isLightMode = false,
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

  const cabinetDrawers = storageLocations.filter(
    (loc) => loc.parentId === activeCabinet?.id || (activeCabinet?.children && activeCabinet.children.some(c => c.id === loc.id))
  );

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
    <div className={`p-4 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            Lagerorte & Schrankverwaltung
          </h1>
          <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Verwalte Schränke, Schubladen und Fächer für eine fehlerfreie Einsortierung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center border rounded-xl p-1 transition-colors ${
              isLightMode ? 'bg-neutral-100 border-neutral-300' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <button
              onClick={() => setViewType('cabinet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewType === 'cabinet'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white'
                  : isLightMode
                  ? 'text-neutral-600 hover:text-neutral-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Schrankansicht (Visuell)
            </button>
            <button
              onClick={() => setViewType('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewType === 'tree'
                  ? isLightMode
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'bg-neutral-800 text-white'
                  : isLightMode
                  ? 'text-neutral-600 hover:text-neutral-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Baumansicht (Hierarchie)
            </button>
          </div>
        </div>
      </div>

      {viewType === 'cabinet' ? (
        /* Visual Cabinet View */
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
                    ? isLightMode
                      ? 'bg-[#0057FF] text-white border-[#0057FF] shadow-sm'
                      : 'bg-white text-black border-white shadow-md'
                    : isLightMode
                    ? 'bg-white text-neutral-700 hover:text-neutral-950 border-neutral-200 hover:border-neutral-300'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>{cab.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    selectedCabinetId === cab.id
                      ? isLightMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-200 text-black'
                      : isLightMode
                      ? 'bg-neutral-100 text-neutral-600'
                      : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {cab.unitCount || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Cabinet Drawer Rack (Left 2 cols) */}
            <div
              className={`lg:col-span-2 rounded-3xl p-6 relative overflow-hidden border transition-colors ${
                isLightMode
                  ? 'bg-white border-neutral-200 shadow-sm text-neutral-900'
                  : 'bg-neutral-950 border-neutral-800/80 shadow-2xl text-white'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-4 border-b mb-6 ${
                  isLightMode ? 'border-neutral-200' : 'border-neutral-900'
                }`}
              >
                <div>
                  <h3 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                    {activeCabinet?.name}
                  </h3>
                  <p className={`text-xs ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {activeCabinet?.description || 'Hauptschrank'}
                  </p>
                </div>
                <span className={`text-xs font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {cabinetDrawers.length > 0 ? `${cabinetDrawers.length} Ebenen / Schubladen` : '1 Ebene'}
                </span>
              </div>

              {/* Rendered Cabinet Drawers / Shelves */}
              <div className="space-y-3">
                {(cabinetDrawers.length > 0 ? cabinetDrawers : [activeCabinet]).map((drawer, idx) => {
                  const isSelected = selectedDrawerId === drawer.id;
                  const estimatedCapacity = 30;
                  const currentCount = drawer.unitCount || 8 + idx * 4;
                  const percentage = Math.min(100, Math.round((currentCount / estimatedCapacity) * 100));

                  return (
                    <div
                      key={drawer.id}
                      onClick={() => setSelectedDrawerId(isSelected ? null : drawer.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                        isSelected
                          ? isLightMode
                            ? 'bg-blue-50/70 border-[#0057FF] ring-1 ring-[#0057FF]'
                            : 'bg-neutral-900/90 border-[#0057FF] shadow-lg shadow-blue-500/10'
                          : isLightMode
                          ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100/70 hover:border-neutral-300'
                          : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/70 hover:border-neutral-700'
                      }`}
                    >
                      {/* Drawer Handle */}
                      <div
                        className={`w-16 h-1.5 mx-auto rounded-full mb-3 shadow-inner transition-colors ${
                          isLightMode
                            ? 'bg-neutral-300 group-hover:bg-neutral-400'
                            : 'bg-neutral-700 group-hover:bg-neutral-500'
                        }`}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl border ${
                              isSelected
                                ? isLightMode
                                  ? 'bg-blue-100 border-blue-300 text-[#0057FF]'
                                  : 'bg-blue-950/60 border-blue-800 text-blue-400'
                                : isLightMode
                                ? 'bg-white border-neutral-300 text-neutral-600'
                                : 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
                            }`}
                          >
                            <Box className="w-4 h-4" />
                          </div>
                          <div>
                            <div className={`text-xs font-semibold flex items-center gap-2 ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                              {drawer.name}
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                  isLightMode
                                    ? 'bg-neutral-200 border-neutral-300 text-neutral-700'
                                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                                }`}
                              >
                                {drawer.type}
                              </span>
                            </div>
                            <div className={`text-[11px] mt-0.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {drawer.description || 'Standardaufbewahrung'}
                            </div>
                          </div>
                        </div>

                        {/* Capacity gauge */}
                        <div className="text-right">
                          <div className={`text-xs font-mono font-bold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                            {currentCount}{' '}
                            <span className={`text-[10px] font-normal ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              / {estimatedCapacity} Kabel
                            </span>
                          </div>
                          <div
                            className={`w-24 h-1.5 rounded-full mt-1.5 overflow-hidden ${
                              isLightMode ? 'bg-neutral-200' : 'bg-neutral-800'
                            }`}
                          >
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
            <div
              className={`rounded-3xl p-6 flex flex-col justify-between border transition-colors ${
                isLightMode
                  ? 'bg-white border-neutral-200 shadow-sm text-neutral-900'
                  : 'bg-neutral-950 border-neutral-800/80 shadow-2xl text-white'
              }`}
            >
              <div>
                <div
                  className={`flex items-center justify-between pb-3 border-b mb-4 ${
                    isLightMode ? 'border-neutral-200' : 'border-neutral-900'
                  }`}
                >
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isLightMode ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    Inhalt {selectedDrawerId ? 'dieser Schublade' : 'im Schrank'}
                  </h3>
                  <span className={`text-xs font-mono ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                    {displayedCables.length} Kabeltypen
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {displayedCables.length === 0 ? (
                    <div className={`py-12 text-center text-xs ${isLightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Keine Kabel in diesem Lagerort zugewiesen.
                    </div>
                  ) : (
                    displayedCables.map((cable) => (
                      <div
                        key={cable.id}
                        onClick={() => onSelectCable(cable)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                          isLightMode
                            ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                            : 'bg-neutral-900/50 border-neutral-800/60 hover:bg-neutral-900 hover:border-neutral-700'
                        }`}
                      >
                        <div
                          className={`text-xs font-medium transition-colors ${
                            isLightMode ? 'text-neutral-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'
                          }`}
                        >
                          {cable.name}
                        </div>
                        <div
                          className={`text-[11px] flex items-center justify-between mt-1 ${
                            isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                          }`}
                        >
                          <span>{cable.connector_a} ↔ {cable.connector_b}</span>
                          <span className={`font-mono font-semibold ${isLightMode ? 'text-neutral-800' : 'text-neutral-300'}`}>
                            {cable.stored} verfügbar
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                className={`pt-4 border-t text-xs text-center ${
                  isLightMode ? 'border-neutral-200 text-neutral-500' : 'border-neutral-900 text-neutral-400'
                }`}
              >
                Wähle eine Schublade aus, um den Inhalt zu filtern.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hierarchical Tree View */
        <div
          className={`rounded-3xl p-6 shadow-sm border transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-neutral-950 border-neutral-800/80 text-white'
          }`}
        >
          <div
            className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
              isLightMode ? 'text-neutral-600' : 'text-neutral-400'
            }`}
          >
            Hierarchische Lagerstruktur
          </div>

          <div className="space-y-2">
            {storageLocations.map((loc) => {
              const isExpanded = expandedNodes[loc.id];
              return (
                <div
                  key={loc.id}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    isLightMode
                      ? 'bg-neutral-50/70 border-neutral-200'
                      : 'border-neutral-800/60 bg-neutral-900/30'
                  }`}
                >
                  <div
                    onClick={() => toggleNode(loc.id)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isLightMode ? 'hover:bg-neutral-100' : 'hover:bg-neutral-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      )}
                      <Archive className="w-4 h-4 text-[#0057FF]" />
                      <span className={`text-xs font-semibold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                        {loc.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isLightMode
                            ? 'bg-neutral-200 border-neutral-300 text-neutral-700'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                        }`}
                      >
                        {loc.type}
                      </span>
                    </div>
                    <span className={`text-xs font-mono ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      {loc.unitCount || 0} Kabel
                    </span>
                  </div>

                  {isExpanded && loc.description && (
                    <div className={`px-10 pb-3 text-xs ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
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

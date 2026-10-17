import React, { useState, useEffect, useRef } from 'react';
import { Search, Cable, Archive, Sparkles, Plus, ArrowRight, CornerDownLeft, X } from 'lucide-react';
import { CableItem, StorageLocation, ActiveView } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cables: CableItem[];
  storageLocations: StorageLocation[];
  onSelectCable: (cable: CableItem) => void;
  onSelectStorage: (storage: StorageLocation) => void;
  onNavigate: (view: ActiveView) => void;
  onOpenAddModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  cables,
  storageLocations,
  onSelectCable,
  onSelectStorage,
  onNavigate,
  onOpenAddModal,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cables' | 'storage' | 'actions'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter cables
  const matchingCables = (filterType === 'all' || filterType === 'cables')
    ? cables.filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.connector_a.toLowerCase().includes(q) ||
          c.connector_b.toLowerCase().includes(q) ||
          (c.color && c.color.toLowerCase().includes(q)) ||
          (c.storageLocationName && c.storageLocationName.toLowerCase().includes(q)) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }).slice(0, 6)
    : [];

  // Filter storage
  const matchingStorage = (filterType === 'all' || filterType === 'storage')
    ? storageLocations.filter((s) => {
        if (!q) return true;
        return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
      }).slice(0, 4)
    : [];

  // Actions
  const actions = [
    {
      id: 'add-cable',
      title: 'Neues Kabel hinzufügen',
      category: 'Aktion',
      icon: <Plus className="w-4 h-4 text-[#0057FF]" />,
      action: () => {
        onClose();
        onOpenAddModal();
      },
    },
    {
      id: 'goto-inventory',
      title: 'Vollständiges Inventar anzeigen',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-neutral-400" />,
      action: () => {
        onClose();
        onNavigate('inventory');
      },
    },
    {
      id: 'goto-movements',
      title: 'Bewegungsverlauf öffnen',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-neutral-400" />,
      action: () => {
        onClose();
        onNavigate('movements');
      },
    },
  ];

  const matchingActions = (filterType === 'all' || filterType === 'actions')
    ? actions.filter((a) => !q || a.title.toLowerCase().includes(q))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kabel, Stecker, Lagerorte oder Befehle suchen..."
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-neutral-900 flex items-center gap-2 text-xs bg-neutral-900/30">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilterType('cables')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'cables'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Kabel
          </button>
          <button
            onClick={() => setFilterType('storage')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'storage'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Lagerorte
          </button>
          <button
            onClick={() => setFilterType('actions')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'actions'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Aktionen
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {matchingCables.length === 0 && matchingStorage.length === 0 && matchingActions.length === 0 && (
            <div className="py-12 text-center text-neutral-500 text-sm">
              Keine Treffer für "{query}" gefunden.
            </div>
          )}

          {/* Cables Group */}
          {matchingCables.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Cable className="w-3 h-3" />
                <span>Kabel & Adapter ({matchingCables.length})</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchingCables.map((cable) => (
                  <button
                    key={cable.id}
                    onClick={() => {
                      onClose();
                      onSelectCable(cable);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-900 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:border-neutral-700">
                        <Cable className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {cable.name}
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-2">
                          <span>{cable.connector_a} ↔ {cable.connector_b}</span>
                          <span>•</span>
                          <span>{cable.color}</span>
                          {cable.length_cm && (
                            <>
                              <span>•</span>
                              <span>{(cable.length_cm / 100).toFixed(1)} m</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-neutral-300">
                        {cable.stored} verfügbar
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {cable.storageLocationName || 'Lager'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Group */}
          {matchingStorage.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Archive className="w-3 h-3" />
                <span>Lagerorte & Schränke ({matchingStorage.length})</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchingStorage.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onClose();
                      onSelectStorage(loc);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-900 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                        <Archive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {loc.name}
                        </div>
                        <div className="text-xs text-neutral-400">{loc.description || loc.type}</div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {loc.unitCount || 0} Kabel
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {matchingActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Schnellaktionen</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchingActions.map((act) => (
                  <button
                    key={act.id}
                    onClick={act.action}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-900 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                        {act.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{act.title}</span>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>↑↓ zum Navigieren</span>
            <span>↵ zum Öffnen</span>
            <span>ESC zum Schließen</span>
          </div>
          <span className="font-mono text-neutral-400">AGF Studios</span>
        </div>
      </div>
    </div>
  );
};

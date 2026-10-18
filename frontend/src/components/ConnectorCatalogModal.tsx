import React, { useState } from 'react';
import { Search, X, Check, Plus, Sparkles } from 'lucide-react';
import { initialConnectors } from '../data/mockData';
import { ConnectorInfo } from '../types';

interface ConnectorCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConnector: (connectorName: string) => void;
  title?: string;
  selectedConnector?: string;
}

export const ConnectorCatalogModal: React.FC<ConnectorCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectConnector,
  title = 'Anschluss auswählen (Katalog)',
  selectedConnector,
}) => {
  const [query, setQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  if (!isOpen) return null;

  const families = ['all', 'USB', 'Display / Video', 'Audio', 'Netzwerk & Strom', 'Apple'];

  const filtered = initialConnectors.filter((c) => {
    const matchesFamily = selectedFamily === 'all' || c.family === selectedFamily;
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(query.toLowerCase()));
    return matchesFamily && matchesQuery;
  });

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    onSelectConnector(customName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog Window */}
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0057FF]" />
              {title}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              51 standardisierte Anschlusstypen in 6 Kategorien
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/30 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Anschluss nach Name oder Spezifikation filtern..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {families.map((fam) => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  selectedFamily === fam
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {fam === 'all' ? 'Alle anzeigen' : fam}
              </button>
            ))}
          </div>
        </div>

        {/* Connectors Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filtered.map((conn) => {
              const isSelected = selectedConnector === conn.name;
              return (
                <button
                  key={conn.name}
                  onClick={() => {
                    onSelectConnector(conn.name);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-neutral-900 border-[#0057FF] ring-1 ring-[#0057FF]'
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 group-hover:text-neutral-300">
                      {conn.family}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0057FF]" />}
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-semibold text-white group-hover:text-blue-400">
                      {conn.name}
                    </div>
                    {conn.description && (
                      <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {conn.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-neutral-500 text-sm">
              Keine Anschlüsse für "{query}" gefunden.
            </div>
          )}
        </div>

        {/* Custom Connector Drawer / Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          {showCustomInput ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Name des benutzerdefinierten Anschlusses (z.B. GX16 Aviation)..."
                className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none"
              />
              <button
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className="px-4 py-1.5 bg-[#0057FF] disabled:opacity-40 text-white text-xs font-semibold rounded-lg"
              >
                Hinzufügen
              </button>
              <button
                onClick={() => setShowCustomInput(false)}
                className="px-2 py-1.5 text-neutral-400 hover:text-white text-xs"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs text-neutral-400">
                Benötigst du einen Spezialanschluss?
              </div>
              <button
                onClick={() => setShowCustomInput(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-xs font-medium text-neutral-200 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Eigenen Anschluss hinzufügen</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, Check, Info } from 'lucide-react';
import { CableItem, StorageLocation } from '../types';

interface AddCableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCable: (cable: Partial<CableItem>, initialCount: number, locationId?: string) => void;
  storageLocations: StorageLocation[];
  onOpenConnectorCatalog: (side: 'A' | 'B') => void;
  selectedSide?: 'A' | 'B';
  prefilledConnector?: string;
}

export const AddCableModal: React.FC<AddCableModalProps> = ({
  isOpen,
  onClose,
  onAddCable,
  storageLocations,
  onOpenConnectorCatalog,
}) => {
  const [connectorA, setConnectorA] = useState('USB-C');
  const [connectorB, setConnectorB] = useState('USB-A');
  const [name, setName] = useState('USB-C auf USB-A');
  const [color, setColor] = useState('Schwarz');
  const [lengthCm, setLengthCm] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [storageLocationId, setStorageLocationId] = useState<string>(
    storageLocations[0]?.id || ''
  );
  const [manufacturer, setManufacturer] = useState('');
  const [cableStandard, setCableStandard] = useState('');
  const [notes, setNotes] = useState('');
  const [rememberSettings, setRememberSettings] = useState(false);

  if (!isOpen) return null;

  const handleConnectorAChange = (val: string) => {
    setConnectorA(val);
    setName(`${val} auf ${connectorB}`);
  };

  const handleConnectorBChange = (val: string) => {
    setConnectorB(val);
    setName(`${connectorA} auf ${val}`);
  };

  const colors = ['Schwarz', 'Weiß', 'Grau', 'Rot', 'Blau', 'Gelb', 'Grün'];
  const quickLengths = [50, 100, 180, 200, 300, 500];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedLoc = storageLocations.find((l) => l.id === storageLocationId);

    onAddCable(
      {
        name,
        connector_a: connectorA,
        connector_b: connectorB,
        color,
        length_cm: lengthCm,
        manufacturer: manufacturer || undefined,
        cable_standard: cableStandard || undefined,
        notes: notes || undefined,
        storageLocationName: selectedLoc ? selectedLoc.name : undefined,
      },
      quantity,
      storageLocationId
    );

    if (!rememberSettings) {
      setManufacturer('');
      setNotes('');
      setCableStandard('');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Neues Kabel erfassen
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Füge einen neuen Kabeltyp oder physische Einheiten zum Inventar hinzu
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Matching Hint Box */}
        <div className="mx-5 mt-4 p-3 rounded-xl bg-blue-950/30 border border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-300">
          <Info className="w-4 h-4 text-[#0057FF] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Symmetrische Erkennung aktiv:</span> Anschlüsse A und B werden richtungsunabhängig abgeglichen.
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Connector Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Stecker A
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={connectorA}
                  onChange={(e) => handleConnectorAChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => onOpenConnectorCatalog('A')}
                  className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-mono"
                  title="Katalog öffnen"
                >
                  ...
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Stecker B
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={connectorB}
                  onChange={(e) => handleConnectorBChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => onOpenConnectorCatalog('B')}
                  className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-mono"
                  title="Katalog öffnen"
                >
                  ...
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Bezeichnung / Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-700"
              required
            />
          </div>

          {/* Color & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Farbe
              </label>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      color === c
                        ? 'bg-white text-black font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Länge
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickLengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLengthCm(l)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                      lengthCm === l
                        ? 'bg-[#0057FF] text-white font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {(l / 100).toFixed(1)}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Initial Storage Location */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Anzahl Einheiten
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Erstlagerort
              </label>
              <select
                value={storageLocationId}
                onChange={(e) => setStorageLocationId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none"
              >
                {storageLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Standard / Specification & Manufacturer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Standard / Spezifikation
              </label>
              <input
                type="text"
                placeholder="z.B. USB 3.2 Gen 2, 100W PD"
                value={cableStandard}
                onChange={(e) => setCableStandard(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Hersteller
              </label>
              <input
                type="text"
                placeholder="z.B. Anker, Apple, Ugreen"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Notizen / Bemerkungen
            </label>
            <textarea
              rows={2}
              placeholder="Zusätzliche Details, z.B. geflochten, abgewinkelt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
            />
          </div>

          {/* Remember Settings */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberSettings}
              onChange={(e) => setRememberSettings(e.target.checked)}
              className="rounded bg-neutral-900 border-neutral-700 text-[#0057FF] focus:ring-0"
            />
            <label htmlFor="remember" className="text-xs text-neutral-400 cursor-pointer">
              Einstellungen für nächstes Kabel merken
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all"
            >
              Kabel speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

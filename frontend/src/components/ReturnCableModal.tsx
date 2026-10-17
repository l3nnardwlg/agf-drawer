import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Archive, MapPin } from 'lucide-react';
import { CableUnit, StorageLocation } from '../types';

interface ReturnCableModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: CableUnit | null;
  cableName?: string;
  storageLocations: StorageLocation[];
  onConfirmReturn: (unitId: string, targetLocationId: string, notes?: string) => void;
}

export const ReturnCableModal: React.FC<ReturnCableModalProps> = ({
  isOpen,
  onClose,
  unit,
  cableName,
  storageLocations,
  onConfirmReturn,
}) => {
  const [targetLocationId, setTargetLocationId] = useState(
    storageLocations[0]?.id || ''
  );
  const [returnNotes, setReturnNotes] = useState('');

  if (!isOpen || !unit) return null;

  const handleReturn = () => {
    onConfirmReturn(unit.id, targetLocationId, returnNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#0057FF]" />
              Kabel einlagern / Rückgabe
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Buche das Kabel zurück in ein Regalfach oder eine Schublade
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transition Visual Card */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-neutral-400">
                {unit.unitIdentifier || 'Einheit #' + unit.id.slice(0, 8)}
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {cableName || 'Kabel'}
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-900">
              In Verwendung
            </span>
          </div>

          {/* Movement Flow (From -> To) */}
          <div className="flex items-center gap-3 px-2 py-3 bg-neutral-900/30 rounded-xl border border-neutral-900">
            <div className="flex-1">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">Aktueller Ort</div>
              <div className="text-xs text-neutral-200 font-medium truncate flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {unit.usageLocation || unit.usage_place || 'Im Einsatz'}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-neutral-500 shrink-0" />

            <div className="flex-1">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">Zielort</div>
              <div className="text-xs text-blue-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                <Archive className="w-3 h-3 text-blue-400" />
                Lager
              </div>
            </div>
          </div>

          {/* Target Location Select */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Ziellagerort auswählen
            </label>
            <select
              value={targetLocationId}
              onChange={(e) => setTargetLocationId(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-700"
            >
              {storageLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Return Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Zustand / Notiz (optional)
            </label>
            <input
              type="text"
              placeholder="z.B. Einwandfrei, aufgerollt mit Klettband"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-700"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleReturn}
            className="px-5 py-2 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Jetzt einlagern</span>
          </button>
        </div>
      </div>
    </div>
  );
};

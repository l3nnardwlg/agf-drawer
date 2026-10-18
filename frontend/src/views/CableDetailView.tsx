import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Archive,
  QrCode,
  CheckCircle2,
  AlertCircle,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { CableItem, CableUnit, StorageLocation, MovementItem } from '../types';
import { CableSchematic } from '../components/CableSchematic';
import { StatusDot } from '../components/StatusDot';

interface CableDetailViewProps {
  cable: CableItem;
  storageLocations: StorageLocation[];
  movements: MovementItem[];
  onBack: () => void;
  onOpenReturnModal: (unit: CableUnit) => void;
  onUpdateUnitStatus: (unitId: string, newStatus: CableUnit['status'], usageLocation?: string) => void;
  onAddUnit: (cableId: string) => void;
  isLightMode?: boolean;
}

export const CableDetailView: React.FC<CableDetailViewProps> = ({
  cable,
  storageLocations,
  movements,
  onBack,
  onOpenReturnModal,
  onUpdateUnitStatus,
  onAddUnit,
  isLightMode = false,
}) => {
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [inUseTarget, setInUseTarget] = useState('Arbeitsplatz Studio A');

  // Filter movements for this cable
  const cableMovements = movements.filter(
    (m) => m.item_name === cable.name || (m.title && m.title.includes(cable.name))
  );

  return (
    <div className={`p-4 md:p-8 space-y-8 max-w-6xl mx-auto transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${
            isLightMode ? 'text-neutral-600 hover:text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zum Kabel-Finder</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddUnit(cable.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              isLightMode
                ? 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Einheit hinzufügen</span>
          </button>

          <button
            onClick={() => alert(`QR-Code / Etikett für ${cable.name} wird gedruckt...`)}
            className={`p-2 rounded-xl border transition-colors ${
              isLightMode
                ? 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Etikett / QR-Code drucken"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Cable Header */}
      <div>
        <div className={`flex items-center gap-2 text-xs font-mono mb-1 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
          <span>{cable.category || 'Kabel'}</span>
          <span>•</span>
          <span>{cable.reference_code || 'REF-' + cable.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
          {cable.name}
        </h1>
        {cable.notes && (
          <p className={`text-xs md:text-sm mt-1 max-w-2xl ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            {cable.notes}
          </p>
        )}
      </div>

      {/* Hero Large Cable Schematic */}
      <CableSchematic
        connectorA={cable.connector_a}
        connectorB={cable.connector_b}
        color={cable.color}
        lengthCm={cable.length_cm}
        size="lg"
        isLightMode={isLightMode}
      />

      {/* 4 Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className={`text-xs font-medium ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Gesamtbestand
          </div>
          <div className={`mt-2 text-2xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            {cable.total}
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Einheiten registriert
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="text-xs font-medium flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-600' : 'text-neutral-400'}>Verfügbar</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isLightMode ? 'bg-[#0057FF]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
              }`}
            />
          </div>
          <div className={`mt-2 text-2xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            {cable.stored}
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Im Schrank gelagert
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="text-xs font-medium flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-600' : 'text-neutral-400'}>In Verwendung</span>
            <span className="w-2 h-2 rounded-full bg-[#0057FF] shadow-[0_0_8px_rgba(0,87,255,0.6)]" />
          </div>
          <div className={`mt-2 text-2xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            {cable.inUse}
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Aktiv im Einsatz
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="text-xs font-medium flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-600' : 'text-neutral-400'}>Vermisst</span>
            <span className="w-2 h-2 rounded-full bg-[#FF2020] shadow-[0_0_8px_rgba(255,32,32,0.8)]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#FF2020]">
            {cable.missing}
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Nicht auffindbar
          </div>
        </div>
      </div>

      {/* Specifications & Storage Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specifications */}
        <div
          className={`p-6 rounded-2xl border space-y-4 transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <h2 className={`text-sm font-semibold tracking-wide ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            Spezifikationen & Technische Daten
          </h2>
          <div className={`divide-y text-xs ${isLightMode ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
            <div className="py-2.5 flex justify-between">
              <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Anschluss A</span>
              <span className={`font-mono font-medium ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>{cable.connector_a}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Anschluss B</span>
              <span className={`font-mono font-medium ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>{cable.connector_b}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Kabellänge</span>
              <span className={`font-mono ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                {cable.length_cm ? `${(cable.length_cm / 100).toFixed(1)} Meter (${cable.length_cm} cm)` : 'Nicht angegeben'}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Mantelfarbe</span>
              <span className={isLightMode ? 'text-neutral-900' : 'text-white'}>{cable.color || 'Schwarz'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Standard / Protokoll</span>
              <span className={isLightMode ? 'text-neutral-900' : 'text-white'}>{cable.cable_standard || 'Standard Spezifikation'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Hersteller</span>
              <span className={isLightMode ? 'text-neutral-900' : 'text-white'}>{cable.manufacturer || 'Unbekannt'}</span>
            </div>
          </div>
        </div>

        {/* Storage Location Info */}
        <div
          className={`p-6 rounded-2xl border space-y-4 transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <h2 className="text-sm font-semibold tracking-wide flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-950' : 'text-white'}>Stammlagerort</span>
            <span className={`text-[11px] font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Präferenz</span>
          </h2>
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isLightMode ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/40 border-neutral-800'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg border text-[#0057FF] ${
                isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-700'
              }`}
            >
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-semibold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                {cable.storageLocationName || 'Hauptlager Schrank A'}
              </div>
              <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Schublade 1 / Fach 2 – Standardort für USB-C & Zubehörkabel.
              </p>
            </div>
          </div>
          <div className={`text-xs leading-relaxed ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Kabel dieses Typs werden standardmäßig hier einsortiert, sofern kein abweichender Arbeitsplatz zugewiesen ist.
          </div>
        </div>
      </div>

      {/* Individual Units */}
      <div
        className={`rounded-2xl border overflow-hidden transition-colors ${
          isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
        }`}
      >
        <div
          className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isLightMode ? 'border-neutral-200' : 'border-neutral-800'
          }`}
        >
          <div>
            <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
              Physische Einheiten ({cable.units?.length || cable.total})
            </h2>
            <p className={`text-xs mt-0.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Jedes reale Kabel besitzt eine eigene Verfolgungshistorie
            </p>
          </div>
          <button
            onClick={() => onAddUnit(cable.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 self-start transition-colors ${
              isLightMode
                ? 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Einheit anlegen</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b font-mono uppercase text-[11px] ${
                isLightMode
                  ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                  : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
              }`}
            >
              <tr>
                <th className="py-3 px-4">Einheit-Kennung</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Aktueller Ort / Verwendung</th>
                <th className="py-3 px-4">Notiz</th>
                <th className="py-3 px-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
              {(cable.units || []).map((unit, index) => {
                const isEditing = editingUnitId === unit.id;
                return (
                  <tr
                    key={unit.id}
                    className={`transition-colors ${
                      isLightMode ? 'hover:bg-neutral-50/80' : 'hover:bg-neutral-900/40'
                    }`}
                  >
                    <td className={`py-3.5 px-4 font-mono font-medium ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                      {unit.unitIdentifier || `UNIT-${index + 1}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusDot status={unit.status} showCount={false} />
                    </td>
                    <td className={`py-3.5 px-4 ${isLightMode ? 'text-neutral-800' : 'text-neutral-300'}`}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={inUseTarget}
                          onChange={(e) => setInUseTarget(e.target.value)}
                          placeholder="z.B. Arbeitsplatz Studio A"
                          className={`px-2 py-1 rounded text-xs border ${
                            isLightMode
                              ? 'bg-white border-neutral-300 text-neutral-900'
                              : 'bg-neutral-900 border-neutral-700 text-white'
                          }`}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>
                            {unit.status === 'in_use'
                              ? unit.usageLocation || unit.usage_place || 'Im Einsatz'
                              : unit.location_name || cable.storageLocationName || 'Lager'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className={`py-3.5 px-4 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {unit.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {unit.status === 'in_use' ? (
                          <button
                            onClick={() => onOpenReturnModal(unit)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                              isLightMode
                                ? 'bg-blue-50 border-blue-200 text-[#0057FF] hover:bg-blue-100'
                                : 'bg-neutral-900 border-neutral-800 text-blue-400 hover:text-blue-300'
                            }`}
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Einlagern</span>
                          </button>
                        ) : unit.status === 'stored' ? (
                          isEditing ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  onUpdateUnitStatus(unit.id, 'in_use', inUseTarget);
                                  setEditingUnitId(null);
                                }}
                                className="px-2 py-1 rounded bg-[#0057FF] text-white text-xs font-semibold"
                              >
                                Bestätigen
                              </button>
                              <button
                                onClick={() => setEditingUnitId(null)}
                                className={`px-1.5 py-1 text-xs ${
                                  isLightMode ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'
                                }`}
                              >
                                Abbrechen
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUnitId(unit.id);
                                setInUseTarget('Arbeitsplatz Studio A');
                              }}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                isLightMode
                                  ? 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
                                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                              }`}
                            >
                              In Verwendung buchen
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => onOpenReturnModal(unit)}
                            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                              isLightMode
                                ? 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                            }`}
                          >
                            Zurück ins Lager
                          </button>
                        )}

                        {/* Quick Mark Missing Toggle */}
                        {unit.status !== 'missing' ? (
                          <button
                            title="Als vermisst melden"
                            onClick={() => onUpdateUnitStatus(unit.id, 'missing')}
                            className="p-1 text-neutral-400 hover:text-[#FF2020] transition-colors"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            title="Gefunden / Wiederherstellen"
                            onClick={() => onUpdateUnitStatus(unit.id, 'stored')}
                            className="p-1 text-emerald-500 hover:text-emerald-400"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement History */}
      {cableMovements.length > 0 && (
        <div
          className={`p-6 rounded-2xl border space-y-4 transition-colors ${
            isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
            Bewegungsprotokoll
          </h2>
          <div className="space-y-2">
            {cableMovements.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isLightMode
                    ? 'bg-neutral-50 border-neutral-200'
                    : 'bg-neutral-900/40 border-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                      isLightMode
                        ? 'bg-neutral-200 text-neutral-800'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {m.user_initials}
                  </div>
                  <div>
                    <span className={`font-medium ${isLightMode ? 'text-neutral-900' : 'text-neutral-200'}`}>
                      {m.title}
                    </span>
                    <span className={`ml-2 font-mono text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {m.from && m.to ? `(${m.from} → ${m.to})` : ''}
                    </span>
                  </div>
                </div>
                <span className={`font-mono text-[11px] ${isLightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {m.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

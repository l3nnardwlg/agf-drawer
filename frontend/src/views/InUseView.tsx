import React, { useMemo } from 'react';
import {
  PlugZap,
  MapPin,
  Clock,
  RotateCcw,
  User,
  ArrowRight,
  Monitor,
  Server,
  Radio,
  Cpu
} from 'lucide-react';
import { CableItem, CableUnit, StorageLocation } from '../types';

interface InUseViewProps {
  cables: CableItem[];
  onOpenReturnModal: (unit: CableUnit, cableName: string) => void;
  onSelectCable: (cable: CableItem) => void;
}

export const InUseView: React.FC<InUseViewProps> = ({
  cables,
  onOpenReturnModal,
  onSelectCable,
}) => {
  // Extract all in-use units with their parent cable info
  const inUseUnits = useMemo(() => {
    const list: { unit: CableUnit; cable: CableItem }[] = [];
    cables.forEach((cable) => {
      (cable.units || []).forEach((u) => {
        if (u.status === 'in_use') {
          list.push({ unit: u, cable });
        }
      });
    });
    return list;
  }, [cables]);

  // Group by location
  const groupedByLocation = useMemo(() => {
    const map: Record<string, typeof inUseUnits> = {};
    inUseUnits.forEach((item) => {
      const loc = item.unit.usageLocation || item.unit.usage_place || 'Unbekannter Arbeitsplatz';
      if (!map[loc]) map[loc] = [];
      map[loc].push(item);
    });
    return map;
  }, [inUseUnits]);

  const getLocationIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('rack') || lower.includes('server')) return <Server className="w-4 h-4 text-blue-400" />;
    if (lower.includes('stream') || lower.includes('kamera')) return <Radio className="w-4 h-4 text-emerald-400" />;
    if (lower.includes('werkbank') || lower.includes('elektronik')) return <Cpu className="w-4 h-4 text-amber-400" />;
    return <Monitor className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <PlugZap className="w-6 h-6 text-[#0057FF]" />
            Kabel in Verwendung
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Übersicht aller Kabel, die aktuell an Geräten, Racks oder Arbeitsplätzen im Einsatz sind.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
            <span className="text-neutral-400">Aktiv im Einsatz: </span>
            <span className="text-white font-bold">{inUseUnits.length} Kabel</span>
          </div>
        </div>
      </div>

      {inUseUnits.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-neutral-950 border border-neutral-900 space-y-3">
          <PlugZap className="w-8 h-8 text-neutral-600 mx-auto" />
          <div className="text-neutral-400 text-sm font-medium">
            Aktuell sind alle Kabel im Lager eingeräumt.
          </div>
          <p className="text-xs text-neutral-400">
            Kabel können in der Kabeldetailansicht oder im Finder in Verwendung gebucht werden.
          </p>
        </div>
      ) : (
        /* Grouped Sections by Location */
        <div className="space-y-6">
          {Object.entries(groupedByLocation).map(([locationName, items]) => (
            <div
              key={locationName}
              className="rounded-3xl bg-neutral-950 border border-neutral-800/80 overflow-hidden shadow-lg"
            >
              {/* Location Group Header */}
              <div className="p-4 md:p-5 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700">
                    {getLocationIcon(locationName)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{locationName}</h2>
                    <span className="text-xs text-neutral-400 font-mono">
                      {items.length} {items.length === 1 ? 'Kabel angeschlossen' : 'Kabel angeschlossen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List in this location */}
              <div className="divide-y divide-neutral-900">
                {items.map(({ unit, cable }) => (
                  <div
                    key={unit.id}
                    className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-900/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                          {unit.unitIdentifier || 'Einheit'}
                        </span>
                        <button
                          onClick={() => onSelectCable(cable)}
                          className="text-sm font-semibold text-white hover:text-blue-400 transition-colors text-left"
                        >
                          {cable.name}
                        </button>
                      </div>

                      <div className="text-xs text-neutral-400 flex items-center gap-2">
                        <span className="font-mono">{cable.connector_a} ↔ {cable.connector_b}</span>
                        <span>•</span>
                        <span>{cable.color || 'Schwarz'}</span>
                        {cable.length_cm && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{(cable.length_cm / 100).toFixed(1)} m</span>
                          </>
                        )}
                      </div>

                      {unit.notes && (
                        <div className="text-[11px] text-neutral-400 italic">
                          "{unit.notes}"
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        onClick={() => onOpenReturnModal(unit, cable.name)}
                        className="px-3 py-1.5 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Kabel einlagern</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

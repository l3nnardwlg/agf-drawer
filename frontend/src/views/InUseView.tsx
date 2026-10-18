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
  isLightMode?: boolean;
}

export const InUseView: React.FC<InUseViewProps> = ({
  cables,
  onOpenReturnModal,
  onSelectCable,
  isLightMode = false,
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
    if (lower.includes('rack') || lower.includes('server')) return <Server className="w-4 h-4 text-blue-500" />;
    if (lower.includes('stream') || lower.includes('kamera')) return <Radio className="w-4 h-4 text-emerald-500" />;
    if (lower.includes('werkbank') || lower.includes('elektronik')) return <Cpu className="w-4 h-4 text-amber-500" />;
    return <Monitor className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2.5 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
            <PlugZap className="w-6 h-6 text-[#0057FF]" />
            Kabel in Verwendung
          </h1>
          <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Übersicht aller Kabel, die aktuell an Geräten, Racks oder Arbeitsplätzen im Einsatz sind.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border text-xs font-mono ${
            isLightMode ? 'bg-white border-neutral-200 text-neutral-800 shadow-xs' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <span className={isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>Aktiv im Einsatz: </span>
            <span className={`font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>{inUseUnits.length} Kabel</span>
          </div>
        </div>
      </div>

      {inUseUnits.length === 0 ? (
        <div className={`py-20 text-center rounded-3xl border space-y-3 ${
          isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-900'
        }`}>
          <PlugZap className="w-8 h-8 text-neutral-400 mx-auto" />
          <div className={`text-sm font-medium ${isLightMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
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
              className={`rounded-3xl border overflow-hidden ${
                isLightMode ? 'bg-white border-neutral-200 shadow-sm' : 'bg-neutral-950 border-neutral-800/80 shadow-lg'
              }`}
            >
              {/* Location Group Header */}
              <div className={`p-4 md:p-5 border-b flex items-center justify-between ${
                isLightMode ? 'bg-neutral-50/80 border-neutral-200' : 'bg-neutral-900/60 border-neutral-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-800 border-neutral-700'
                  }`}>
                    {getLocationIcon(locationName)}
                  </div>
                  <div>
                    <h2 className={`text-sm font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>{locationName}</h2>
                    <span className={`text-xs font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {items.length} {items.length === 1 ? 'Kabel angeschlossen' : 'Kabel angeschlossen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List in this location */}
              <div className={`divide-y ${isLightMode ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
                {items.map(({ unit, cable }) => (
                  <div
                    key={unit.id}
                    className={`p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isLightMode ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/30'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          isLightMode ? 'bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}>
                          {unit.unitIdentifier || 'Einheit'}
                        </span>
                        <button
                          onClick={() => onSelectCable(cable)}
                          className={`text-sm font-semibold transition-colors text-left ${
                            isLightMode ? 'text-neutral-900 hover:text-[#0057FF]' : 'text-white hover:text-blue-400'
                          }`}
                        >
                          {cable.name}
                        </button>
                      </div>

                      <div className={`text-xs flex items-center gap-2 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
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
                        <div className={`text-[11px] italic ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
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

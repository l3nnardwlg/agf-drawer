import React, { useState } from 'react';
import {
  Search,
  Plus,
  ArrowRight,
  Archive,
  PlugZap,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  MoveRight
} from 'lucide-react';
import { CableItem, StorageLocation, MovementItem, ActiveView } from '../types';
import { CableSchematic } from '../components/CableSchematic';
import { StatusDot } from '../components/StatusDot';

interface OverviewViewProps {
  cables: CableItem[];
  storageLocations: StorageLocation[];
  movements: MovementItem[];
  onSelectCable: (cable: CableItem) => void;
  onNavigate: (view: ActiveView) => void;
  onOpenAddModal: () => void;
  onSearchSubmit: (query: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  cables,
  storageLocations,
  movements,
  onSelectCable,
  onNavigate,
  onOpenAddModal,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const totalCables = cables.reduce((acc, c) => acc + c.total, 0);
  const totalStored = cables.reduce((acc, c) => acc + c.stored, 0);
  const totalInUse = cables.reduce((acc, c) => acc + c.inUse, 0);
  const totalLoaned = cables.reduce((acc, c) => acc + c.loaned, 0);
  const totalMissing = cables.reduce((acc, c) => acc + c.missing, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      onNavigate('cable-finder');
    }
  };

  const quickPills = ['USB-C', 'HDMI', 'Thunderbolt', 'Ethernet', 'Kaltgeräte', 'DisplayPort'];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Editorial Hero Search Section */}
      <div className="relative rounded-3xl bg-neutral-950 border border-neutral-800/80 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0057FF]" />
            AGF Drawer Inventarsystem
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight leading-tight">
            Welches Kabel suchst du?
          </h1>
          <p className="mt-3 text-sm md:text-base text-neutral-400 max-w-xl">
            Wissen, was du hast. Finden, was du brauchst. Symmetrische Suche nach Steckern, Kabellängen und Lagerorten.
          </p>

          {/* Search bar input */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="z.B. USB-C auf HDMI, Kaltgerätekabel oder Schrank A..."
                className="w-full pl-12 pr-4 py-3 bg-neutral-900/90 border border-neutral-700/80 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF] transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Suchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 font-mono">Beliebte Filter:</span>
            {quickPills.map((p) => (
              <button
                key={p}
                onClick={() => {
                  onSearchSubmit(p);
                  onNavigate('cable-finder');
                }}
                className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards (Figma specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-medium">Gesamtbestand</div>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">{totalCables}</span>
            <span className="text-xs text-neutral-400 ml-1.5">Kabel</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">{cables.length} Typen</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-medium flex items-center justify-between">
            <span>Verfügbar</span>
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          </div>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">{totalStored}</span>
            <span className="text-xs text-neutral-400 ml-1.5">im Lager</span>
          </div>
          <div className="text-[11px] text-neutral-400">Sofort griffbereit</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-medium flex items-center justify-between">
            <span>In Verwendung</span>
            <span className="w-2 h-2 rounded-full bg-[#0057FF] shadow-[0_0_8px_rgba(0,87,255,0.6)]" />
          </div>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">{totalInUse}</span>
            <span className="text-xs text-neutral-400 ml-1.5">aktiv</span>
          </div>
          <div className="text-[11px] text-neutral-400">Arbeitsplatz & Racks</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-medium flex items-center justify-between">
            <span>Verliehen</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </div>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-white">{totalLoaned}</span>
            <span className="text-xs text-neutral-400 ml-1.5">ausgeliehen</span>
          </div>
          <div className="text-[11px] text-neutral-400">Mit Fälligkeit</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
          <div className="text-xs text-neutral-400 font-medium flex items-center justify-between">
            <span>Vermisst</span>
            <span className="w-2 h-2 rounded-full bg-[#FF2020] shadow-[0_0_8px_rgba(255,32,32,0.8)]" />
          </div>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-[#FF2020]">{totalMissing}</span>
            <span className="text-xs text-neutral-400 ml-1.5">fehlen</span>
          </div>
          <div className="text-[11px] text-neutral-400">Prüfung empfohlen</div>
        </div>
      </div>

      {/* Main Grid: Recently Added & Storage / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recently Added Cables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Kürzlich erfasst & aktiv</h2>
              <p className="text-xs text-neutral-400">Direkter Zugriff auf deine Kabeltypen</p>
            </div>
            <button
              onClick={() => onNavigate('cable-finder')}
              className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 group"
            >
              <span>Alle im Finder ansehen</span>
              <MoveRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cables.slice(0, 4).map((cable) => (
              <div
                key={cable.id}
                onClick={() => onSelectCable(cable)}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="font-mono text-[11px]">{cable.category || 'Kabel'}</span>
                    <span className="font-mono text-neutral-400">
                      {cable.storageLocationName || 'Lagerort'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {cable.name}
                  </h3>
                </div>

                {/* Visual SVG Schematic */}
                <CableSchematic
                  connectorA={cable.connector_a}
                  connectorB={cable.connector_b}
                  color={cable.color}
                  lengthCm={cable.length_cm}
                  size="md"
                />

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900 text-xs">
                  <StatusDot status="stored" count={cable.stored} label="Lager" />
                  <StatusDot status="in_use" count={cable.inUse} label="In Nutzung" />
                  <span className="font-mono text-neutral-400">{cable.total} gesamt</span>
                </div>
              </div>
            ))}
          </div>

          {/* Categories Quick Access Banner */}
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white">Brauchst du weitere Kabel?</div>
              <div className="text-[11px] text-neutral-400">
                Erfasse neue Typen oder buche vorhandene Bestände um.
              </div>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Neues Kabel anlegen</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Storage Locations & Activity Ledger */}
        <div className="space-y-6">
          {/* Storage Locations Quick List */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5 text-[#0057FF]" />
                Lagerorte Übersicht
              </h3>
              <button
                onClick={() => onNavigate('storage')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Schränke öffnen
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {storageLocations.slice(0, 3).map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => onNavigate('storage')}
                  className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:bg-neutral-900 hover:border-neutral-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{loc.name}</div>
                    <div className="text-[11px] text-neutral-400">{loc.description || loc.type}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      {loc.unitCount || 0}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">Kabel</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Movements Feed */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Letzte Bewegungen
              </h3>
              <button
                onClick={() => onNavigate('movements')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Verlauf
              </button>
            </div>

            <div className="space-y-2.5 mt-2">
              {movements.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-neutral-900/30 border border-neutral-900 flex items-start gap-2.5 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-300 shrink-0 mt-0.5">
                    {m.user_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-neutral-200 font-medium truncate">{m.title}</div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      {m.from && m.to ? `${m.from} → ${m.to}` : m.item_name}
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                    {m.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

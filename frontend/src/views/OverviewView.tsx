import React, { useState } from 'react';
import {
  Search,
  Plus,
  ArrowRight,
  Archive,
  Clock,
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
  isLightMode?: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  cables,
  storageLocations,
  movements,
  onSelectCable,
  onNavigate,
  onOpenAddModal,
  onSearchSubmit,
  isLightMode = false,
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
    <div className={`p-6 md:p-8 space-y-8 max-w-7xl mx-auto transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
      {/* Editorial Hero Search Section */}
      <div
        className={`relative rounded-3xl p-8 md:p-12 overflow-hidden border transition-colors ${
          isLightMode
            ? 'bg-white border-neutral-200 shadow-sm'
            : 'bg-neutral-950 border-neutral-800/80 shadow-2xl'
        }`}
      >
        <div
          className={`absolute inset-0 [background-size:24px_24px] pointer-events-none ${
            isLightMode
              ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-50'
              : 'bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] opacity-40'
          }`}
        />
        <div className="relative z-10 max-w-3xl">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-4 ${
              isLightMode
                ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0057FF]" />
            AGF Drawer Inventarsystem
          </div>
          <h1
            className={`font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight ${
              isLightMode ? 'text-neutral-950' : 'text-white'
            }`}
          >
            Welches Kabel suchst du?
          </h1>
          <p
            className={`mt-3 text-sm md:text-base max-w-xl ${
              isLightMode ? 'text-neutral-600' : 'text-neutral-400'
            }`}
          >
            Wissen, was du hast. Finden, was du brauchst. Symmetrische Suche nach Steckern, Kabellängen und Lagerorten.
          </p>

          {/* Search bar input */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search
                className={`w-5 h-5 absolute left-4 top-3.5 ${
                  isLightMode ? 'text-neutral-400' : 'text-neutral-400'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="z.B. USB-C auf HDMI, Kaltgerätekabel oder Schrank A..."
                className={`w-full pl-12 pr-4 py-3 rounded-2xl text-sm transition-all focus:outline-none focus:border-[#0057FF] border ${
                  isLightMode
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                    : 'bg-neutral-900/90 border-neutral-700/80 text-white placeholder-neutral-500 shadow-inner'
                }`}
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
            <span
              className={`text-xs font-mono ${
                isLightMode ? 'text-neutral-500' : 'text-neutral-500'
              }`}
            >
              Beliebte Filter:
            </span>
            {quickPills.map((p) => (
              <button
                key={p}
                onClick={() => {
                  onSearchSubmit(p);
                  onNavigate('cable-finder');
                }}
                className={`px-3 py-1 rounded-lg text-xs transition-colors border ${
                  isLightMode
                    ? 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/70'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-colors ${
            isLightMode
              ? 'bg-white border-neutral-200 shadow-xs'
              : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className={`text-xs font-medium ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Gesamtbestand
          </div>
          <div className="my-2">
            <span className={`text-2xl md:text-3xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
              {totalCables}
            </span>
            <span className={`text-xs ml-1.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Kabel
            </span>
          </div>
          <div className={`text-[11px] font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {cables.length} Typen
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-colors ${
            isLightMode
              ? 'bg-white border-neutral-200 shadow-xs'
              : 'bg-neutral-950 border-neutral-800/80'
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
          <div className="my-2">
            <span className={`text-2xl md:text-3xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
              {totalStored}
            </span>
            <span className={`text-xs ml-1.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              im Lager
            </span>
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Sofort griffbereit
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-colors ${
            isLightMode
              ? 'bg-white border-neutral-200 shadow-xs'
              : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="text-xs font-medium flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-600' : 'text-neutral-400'}>In Verwendung</span>
            <span className="w-2 h-2 rounded-full bg-[#0057FF] shadow-[0_0_8px_rgba(0,87,255,0.6)]" />
          </div>
          <div className="my-2">
            <span className={`text-2xl md:text-3xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
              {totalInUse}
            </span>
            <span className={`text-xs ml-1.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              aktiv
            </span>
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Arbeitsplatz & Racks
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-colors ${
            isLightMode
              ? 'bg-white border-neutral-200 shadow-xs'
              : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="text-xs font-medium flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-600' : 'text-neutral-400'}>Verliehen</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </div>
          <div className="my-2">
            <span className={`text-2xl md:text-3xl font-bold font-mono ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
              {totalLoaned}
            </span>
            <span className={`text-xs ml-1.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              ausgeliehen
            </span>
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Mit Fälligkeit
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-colors ${
            isLightMode
              ? 'bg-white border-neutral-200 shadow-xs'
              : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div className="text-xs font-medium flex items-center justify-between">
            <span className={isLightMode ? 'text-neutral-600' : 'text-neutral-400'}>Vermisst</span>
            <span className="w-2 h-2 rounded-full bg-[#FF2020] shadow-[0_0_8px_rgba(255,32,32,0.8)]" />
          </div>
          <div className="my-2">
            <span className="text-2xl md:text-3xl font-bold font-mono text-[#FF2020]">
              {totalMissing}
            </span>
            <span className={`text-xs ml-1.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              fehlen
            </span>
          </div>
          <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Prüfung empfohlen
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Added & Storage / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recently Added Cables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-base font-semibold ${isLightMode ? 'text-neutral-950' : 'text-white'}`}>
                Kürzlich erfasst & aktiv
              </h2>
              <p className={`text-xs ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Direkter Zugriff auf deine Kabeltypen
              </p>
            </div>
            <button
              onClick={() => onNavigate('cable-finder')}
              className={`text-xs font-medium flex items-center gap-1 group transition-colors ${
                isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'
              }`}
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-3 ${
                  isLightMode
                    ? 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                    : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div
                    className={`flex items-center justify-between text-xs mb-2 ${
                      isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    <span className="font-mono text-[11px]">{cable.category || 'Kabel'}</span>
                    <span className="font-mono">
                      {cable.storageLocationName || 'Lagerort'}
                    </span>
                  </div>
                  <h3
                    className={`text-sm font-semibold transition-colors ${
                      isLightMode ? 'text-neutral-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'
                    }`}
                  >
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
                  isLightMode={isLightMode}
                />

                <div
                  className={`flex items-center justify-between pt-2 border-t text-xs ${
                    isLightMode ? 'border-neutral-100' : 'border-neutral-900'
                  }`}
                >
                  <StatusDot status="stored" count={cable.stored} label="Lager" />
                  <StatusDot status="in_use" count={cable.inUse} label="In Nutzung" />
                  <span className={`font-mono ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {cable.total} gesamt
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access Banner */}
          <div
            className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
              isLightMode
                ? 'bg-blue-50 border-blue-200 text-neutral-900'
                : 'bg-neutral-900/40 border-neutral-800'
            }`}
          >
            <div>
              <div className={`text-xs font-semibold ${isLightMode ? 'text-blue-950' : 'text-white'}`}>
                Brauchst du weitere Kabel?
              </div>
              <div className={`text-[11px] ${isLightMode ? 'text-blue-800' : 'text-neutral-400'}`}>
                Erfasse neue Typen oder buche vorhandene Bestände um.
              </div>
            </div>
            <button
              onClick={onOpenAddModal}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isLightMode
                  ? 'bg-[#0057FF] text-white hover:bg-blue-600 shadow-sm'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Neues Kabel anlegen</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Storage Locations & Activity Ledger */}
        <div className="space-y-6">
          {/* Storage Locations Quick List */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLightMode
                ? 'bg-white border-neutral-200 shadow-xs'
                : 'bg-neutral-950 border-neutral-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLightMode ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-[#0057FF]" />
                Lagerorte Übersicht
              </h3>
              <button
                onClick={() => onNavigate('storage')}
                className={`text-xs ${
                  isLightMode ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Schränke öffnen
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {storageLocations.slice(0, 3).map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => onNavigate('storage')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isLightMode
                      ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                      : 'bg-neutral-900/50 border-neutral-800/60 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className={`text-xs font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                      {loc.name}
                    </div>
                    <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {loc.description || loc.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                      {loc.unitCount || 0}
                    </span>
                    <span className={`text-[10px] block ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Kabel
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Movements Feed */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLightMode
                ? 'bg-white border-neutral-200 shadow-xs'
                : 'bg-neutral-950 border-neutral-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLightMode ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Letzte Bewegungen
              </h3>
              <button
                onClick={() => onNavigate('movements')}
                className={`text-xs ${
                  isLightMode ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Verlauf
              </button>
            </div>

            <div className="space-y-2.5 mt-2">
              {movements.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    isLightMode
                      ? 'bg-neutral-50 border-neutral-200'
                      : 'bg-neutral-900/30 border-neutral-900'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                      isLightMode
                        ? 'bg-neutral-200 text-neutral-800'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {m.user_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${isLightMode ? 'text-neutral-900' : 'text-neutral-200'}`}>
                      {m.title}
                    </div>
                    <div className={`text-[11px] truncate ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {m.from && m.to ? `${m.from} → ${m.to}` : m.item_name}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono shrink-0 ${isLightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
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

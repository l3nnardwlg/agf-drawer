import React from 'react';
import { Palette, Layers, Sparkles, Check, AlertCircle } from 'lucide-react';
import { CableSchematic } from '../components/CableSchematic';
import { StatusDot } from '../components/StatusDot';

export const DesignSystemView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0057FF]" />
          AGF Studios Design System 002
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl font-normal text-white tracking-tight">
          UI-Bibliothek & Design Tokens
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
          Spezifikation aller Farben, Typografie, interaktiven Komponenten und Icons für das AGF Drawer Ökosystem.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
          01. Farbpalette (Design Tokens)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-2">
            <div className="h-16 rounded-xl bg-black border border-neutral-800" />
            <div className="text-xs font-semibold text-white">Pure Black</div>
            <div className="text-[11px] font-mono text-neutral-400">#000000 • Hintergrund</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="h-16 rounded-xl bg-[#0057FF] shadow-lg shadow-blue-500/30" />
            <div className="text-xs font-semibold text-white">Electric Blue</div>
            <div className="text-[11px] font-mono text-neutral-400">#0057FF • Primäraktion</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="h-16 rounded-xl bg-[#FF2020] shadow-lg shadow-red-500/30" />
            <div className="text-xs font-semibold text-white">Signal Red</div>
            <div className="text-[11px] font-mono text-neutral-400">#FF2020 • Warnung / Vermisst</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="h-16 rounded-xl bg-white" />
            <div className="text-xs font-semibold text-white">Pure White</div>
            <div className="text-[11px] font-mono text-neutral-400">#FFFFFF • Text / Highlights</div>
          </div>
        </div>
      </div>

      {/* 2. Typography Hierarchy */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
          02. Typografie & Schriften
        </h2>
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Fraunces Serif • Editorial Headline</span>
            <div className="font-editorial text-3xl text-white">
              Wissen, was du hast. Finden, was du brauchst.
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Inter Sans-Serif • UI & System Text</span>
            <div className="text-sm text-neutral-300">
              Präzise Benutzeroberfläche für schnelle Suche und übersichtliche Lagerverwaltung.
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Mono • Identifiers & Metriken</span>
            <div className="font-mono text-xs text-neutral-300">
              KBL-0042 • USB-C ↔ USB-A • 1.8m • 100W PD
            </div>
          </div>
        </div>
      </div>

      {/* 3. Status Indicators */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
          03. Status-Indikatoren
        </h2>
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-wrap gap-6 items-center">
          <StatusDot status="stored" count={42} label="Verfügbar" />
          <StatusDot status="in_use" count={18} label="In Verwendung" />
          <StatusDot status="loaned" count={4} label="Verliehen" />
          <StatusDot status="missing" count={2} label="Vermisst" />
          <StatusDot status="retired" count={1} label="Ausgemustert" />
        </div>
      </div>

      {/* 4. Cable Schematic Illustration Showcase */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
          04. Schematische Kabel-Illustration
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono text-neutral-400 mb-2 block">Größe: Groß (Detailseite)</span>
            <CableSchematic
              connectorA="USB-C"
              connectorB="USB-A"
              color="Schwarz"
              lengthCm={180}
              size="lg"
            />
          </div>

          <div>
            <span className="text-xs font-mono text-neutral-400 mb-2 block">Größe: Mittel (Finder Karten)</span>
            <CableSchematic
              connectorA="HDMI"
              connectorB="DisplayPort"
              color="Rot"
              lengthCm={200}
              size="md"
            />
          </div>

          <div>
            <span className="text-xs font-mono text-neutral-400 mb-2 block">Größe: Klein (Listenzeile)</span>
            <CableSchematic
              connectorA="Thunderbolt 4"
              connectorB="USB-C"
              color="Weiß"
              lengthCm={100}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* 5. Buttons & Interaktive Controls */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
          05. Schaltflächen & Controls
        </h2>
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-wrap gap-4 items-center">
          <button className="px-5 py-2.5 bg-[#0057FF] hover:bg-blue-600 text-white font-medium text-xs rounded-xl shadow-md">
            Primär Electric Blue
          </button>
          <button className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-xs rounded-xl">
            Sekundär Weiß
          </button>
          <button className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-medium text-xs rounded-xl">
            Subtil Outline
          </button>
          <button className="px-5 py-2.5 bg-[#FF2020] hover:bg-red-600 text-white font-semibold text-xs rounded-xl shadow-md">
            Signal Red Aktion
          </button>
        </div>
      </div>
    </div>
  );
};

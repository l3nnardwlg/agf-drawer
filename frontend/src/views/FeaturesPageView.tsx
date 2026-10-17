import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Archive,
  PlugZap,
  Sparkles,
  Shield,
  Layers,
  Cpu,
  CheckCircle2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { AppRoute } from '../types';
import { initialConnectors } from '../data/mockData';

interface FeaturesPageViewProps {
  onNavigateRoute: (route: AppRoute) => void;
  onOpenDashboard: () => void;
}

export const FeaturesPageView: React.FC<FeaturesPageViewProps> = ({
  onNavigateRoute,
  onOpenDashboard,
}) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0057FF] selection:text-white flex flex-col justify-between">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-neutral-800/80 px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigateRoute('landing')}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateRoute('pricing')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white"
          >
            Preise
          </button>
          <button
            onClick={onOpenDashboard}
            className="px-4 py-2 rounded-xl bg-[#0057FF] hover:bg-blue-600 text-xs font-semibold text-white shadow-md shadow-blue-500/20"
          >
            Dashboard starten
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono text-[#0057FF] uppercase tracking-wider">
            AGF Drawer Feature Tour
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white font-normal">
            Funktionen, die Ordnung schaffen.
          </h1>
          <p className="text-sm text-neutral-400">
            Jedes Detail von AGF Drawer wurde für reale Hardware-Workflows in Werkstatt, Homelab und Studio entwickelt.
          </p>
        </div>

        {/* Feature 1: Symmetrische Kabelsuche */}
        <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900 text-[#0057FF] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Symmetrische Kabelsuche
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Bei Kabeln existiert selten eine eindeutige "Richtung". Wer nach einem Verbindungskabel sucht, gibt oft "USB-C auf HDMI" ein, obwohl das Kabel technisch als "HDMI auf USB-C" erfasst wurde.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Die AGF Drawer Symmetrie-Engine normalisiert Anschluss-Paare automatisch. Deine Suche liefert immer verlässliche Treffer – unabhängig von der Reihenfolge der Stecker.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3 text-xs font-mono">
            <div className="text-neutral-500">// Suchbeispiel</div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400">
              Query: "USB-C HDMI"
            </div>
            <div className="text-neutral-400">Matcht beidseitig:</div>
            <div className="space-y-1 text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>USB-C → HDMI (2.0 m) [Schrank A / Schublade 1]</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>HDMI → USB-C (1.5 m) [Schrank B / Fach 3]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Visuelle Schränke & Hierarchien */}
        <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-neutral-800">
              <span>Schrank A (Hauptwerkstatt)</span>
              <span>3 Ebenen</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-white font-medium">Schublade 1: USB-C & Thunderbolt</span>
                <span className="font-mono text-blue-400">18 / 25 Kabel</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-white font-medium">Schublade 2: Video & Display</span>
                <span className="font-mono text-blue-400">12 / 20 Kabel</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-white font-medium">Schublade 3: Patchkabel</span>
                <span className="font-mono text-blue-400">9 / 15 Kabel</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Visuelle Schrankverwaltung
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Keine abstrakten Textlisten mehr: Sieh genau, in welchem Schrank, in welcher Schublade und in welchem Fach ein Kabel liegt.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Unterstützt unbegrenzte hierarchische Schachtelung (Raum → Schrank → Schublade → Box/Fach) mit integrierter Zykluserkennung über relationale CTEs.
            </p>
          </div>
        </div>

        {/* Feature 3: Der Hardware-Katalog mit 51 Anschlüssen */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Der 51-Anschluss-Katalog</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Sofort einsatzbereit für alle gängigen und historischen Schnittstellen
              </p>
            </div>
            <button
              onClick={onOpenDashboard}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs font-semibold text-white self-start sm:self-center"
            >
              Im Dashboard öffnen
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {initialConnectors.map((c) => (
              <div
                key={c.name}
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between space-y-2 hover:border-neutral-700 transition-colors"
              >
                <span className="text-[10px] font-mono uppercase text-blue-400">
                  {c.family}
                </span>
                <div>
                  <div className="text-xs font-semibold text-white">{c.name}</div>
                  {c.description && (
                    <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {c.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 4: Audit & Tracking */}
        <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800/80 space-y-4">
          <h2 className="text-xl font-bold text-white">Lückenloses Audit & QR-Code Druck</h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Jede Zustandsänderung (Ausbuchen an ein Gerät, Rückgabe in eine Schublade, Verleihen mit Rückgabedatum) wird im unveränderbaren Bewegungsverlauf protokolliert. Erstelle Etiketten für Koffer und Regalfächer auf Knopfdruck.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black py-8 px-6 text-center text-xs text-neutral-500">
        AGF Drawer • Gebaut für Präzision und Langlebigkeit.
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Search,
  Archive,
  PlugZap,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Layers,
  ChevronRight,
  MoveRight,
  Cpu,
  Boxes
} from 'lucide-react';
import { AppRoute } from '../types';
import { CableSchematic } from '../components/CableSchematic';

interface LandingPageViewProps {
  onNavigateRoute: (route: AppRoute) => void;
  onOpenDashboard: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigateRoute,
  onOpenDashboard,
}) => {
  const [demoConnectorA, setDemoConnectorA] = useState('USB-C');
  const [demoConnectorB, setDemoConnectorB] = useState('HDMI');
  const [demoLength, setDemoLength] = useState(200);

  const connectorOptions = ['USB-C', 'USB-A', 'HDMI', 'DisplayPort', 'Thunderbolt 4', 'RJ45 Ethernet'];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0057FF] selection:text-white flex flex-col justify-between">
      {/* Top SaaS Public Navigation */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-neutral-800/80 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigateRoute('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white shadow-sm group-hover:border-neutral-500 transition-colors">
              <span className="text-white text-xs font-mono tracking-tighter">AGF</span>
            </div>
            <div>
              <div className="font-semibold text-sm text-white tracking-tight flex items-center gap-1.5">
                AGF Drawer
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-blue-400 border border-neutral-700">
                  SaaS v1.0
                </span>
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400">
            <button
              onClick={() => onNavigateRoute('features')}
              className="hover:text-white transition-colors"
            >
              Funktionen
            </button>
            <button
              onClick={() => onNavigateRoute('pricing')}
              className="hover:text-white transition-colors"
            >
              Preise & Pläne
            </button>
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>API Dokumentation</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateRoute('login')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            Anmelden
          </button>
          <button
            onClick={onOpenDashboard}
            className="px-4 py-2 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5"
          >
            <span>Dashboard öffnen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main SaaS Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 md:pt-24 pb-20 px-6 max-w-6xl mx-auto text-center overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none -z-10" />

          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0057FF] animate-pulse" />
            <span>AGF Studios Design System 002 • Next-Gen Hardware Inventory</span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Wissen, was du hast. <br />
            <span className="italic text-neutral-200">Finden, was du brauchst.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Nie wieder Kisten durchwühlen. Das moderne SaaS-Inventarsystem für Kabel, Adapter und Hardware.
            Mit symmetrischer Suche, visuellen Schubladen und lückenloser Verfolgung.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Live im Dashboard starten</span>
              <MoveRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateRoute('features')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-sm font-medium text-neutral-200 hover:text-white transition-colors"
            >
              Funktionen entdecken
            </button>
          </div>

          {/* Terminal / Self-host badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">Schnellstart:</span>
            <code className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              docker compose up -d
            </code>
          </div>

          {/* Interactive Live Schematic Showcase */}
          <div className="mt-14 p-6 md:p-8 rounded-3xl bg-neutral-950 border border-neutral-800/80 shadow-2xl max-w-4xl mx-auto text-left relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900 mb-6">
              <div>
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block">
                  Interaktive Live-Vorschau
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">
                  Symmetrischer Hardware-Kabel-Schematisierer
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Live Rendering</span>
              </div>
            </div>

            {/* Interactive Schematic Component */}
            <CableSchematic
              connectorA={demoConnectorA}
              connectorB={demoConnectorB}
              color="Schwarz"
              lengthCm={demoLength}
              size="lg"
            />

            {/* Interactive Switchers */}
            <div className="mt-6 pt-4 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1.5 font-medium">Stecker A auswählen:</label>
                <select
                  value={demoConnectorA}
                  onChange={(e) => setDemoConnectorA(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs focus:outline-none"
                >
                  {connectorOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1.5 font-medium">Stecker B auswählen:</label>
                <select
                  value={demoConnectorB}
                  onChange={(e) => setDemoConnectorB(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs focus:outline-none"
                >
                  {connectorOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1.5 font-medium">Kabellänge:</label>
                <div className="flex gap-1.5">
                  {[100, 200, 300].map((l) => (
                    <button
                      key={l}
                      onClick={() => setDemoLength(l)}
                      className={`flex-1 py-1.5 rounded-lg border font-mono transition-colors ${
                        demoLength === l
                          ? 'bg-neutral-800 border-neutral-600 text-white font-bold'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {l / 100}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Key Pillars / Features Grid */}
        <section className="py-20 px-6 max-w-6xl mx-auto border-t border-neutral-900">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-[#0057FF] uppercase tracking-wider">
              Präzise Architektur
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white mt-2">
              Alles hat seinen festen Platz.
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Gebaut für Tech-Enthusiasten, Homelabs, Recording-Studios, Event-Technik und Reparaturwerkstätten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900 text-[#0057FF] flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Symmetrische Kabelsuche</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Reihenfolge egal: Ob "USB-C auf HDMI" oder "HDMI auf USB-C" – der integrierte Suchalgorithmus findet deine Kabel sofort.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <Archive className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Visuelle Schränke & Schubladen</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Modelliere reale Regale, Koffer und Schubladen mit prozentualer Füllstandsanzeige und Fächerunterteilung.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <PlugZap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">In Verwendung & Verleih</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Weise Kabel konkreten Geräten, Racks oder Personen zu. 1-Klick-Rückgabe bucht das Kabel direkt wieder an seinen Stammort.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">51 Anschlüsse im Katalog</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Standardisiert von USB4 und HDMI 2.1 bis zu XLR, Kaltgeräte C13 und Apple MagSafe – plus eigene Anschlüsse anlegbar.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Mandantenfähigkeit & RBAC</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Verwalte mehrere Workspaces getrennt. Rollen (Owner, Admin, Editor, Viewer) für sichere Teamzusammenarbeit.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Fastify REST API & OpenAPI 3.1</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Vollständig programmierbar. Integriere Barcode-Scanner, Heimautomatisierung oder bestehende ERP-Systeme.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Teaser Section */}
        <section className="py-20 px-6 max-w-5xl mx-auto border-t border-neutral-900 text-center">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Transparente Preisgestaltung
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white mt-2">
            Starte kostenlos. Skaliere mit deinem Team.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Vom Bastelkeller bis zum professionellen Verleihpark – wähle den Plan, der zu deinen Anforderungen passt.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Free */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">Community</span>
                <div className="mt-2 text-2xl font-bold text-white">0 €</div>
                <div className="text-[11px] text-neutral-500">Für immer kostenlos</div>
                <ul className="mt-5 space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unbegrenzt Kabel & Einheiten</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1 Workspace (Homelab)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Voller Self-Hosting Docker Support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenDashboard}
                className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-white"
              >
                Kostenlos starten
              </button>
            </div>

            {/* Pro Studio (Highlighted) */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-[#0057FF] shadow-lg shadow-blue-500/10 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#0057FF] text-white text-[10px] font-mono font-bold">
                BELIEBT
              </div>
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase">Pro Studio</span>
                <div className="mt-2 text-2xl font-bold text-white">12 € <span className="text-xs font-normal text-neutral-400">/ Monat</span></div>
                <div className="text-[11px] text-neutral-500">Für Studios & Werkstätten</div>
                <ul className="mt-5 space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Bis zu 5 Workspaces</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Team-Mitglieder & Rollen (RBAC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>QR-Code & Etikettendruck</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Lückenloses Audit-Log</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenDashboard}
                className="w-full py-2.5 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white shadow-md shadow-blue-500/20"
              >
                Studio testen
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">Enterprise</span>
                <div className="mt-2 text-2xl font-bold text-white">Individuell</div>
                <div className="text-[11px] text-neutral-500">Für Verleiher & Universitäten</div>
                <ul className="mt-5 space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Unbegrenzte Workspaces</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>SAML / SSO & LDAP Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Dedizierte SLA & Prioritäts-Support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigateRoute('pricing')}
                className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-white"
              >
                Details ansehen
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-neutral-900 bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-white text-xs">
              AGF
            </div>
            <div>
              <div className="text-xs font-semibold text-white">AGF Drawer</div>
              <div className="text-[11px] text-neutral-500">© 2026 AGF Studios. Alle Rechte vorbehalten.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <button onClick={() => onNavigateRoute('features')} className="hover:text-white">
              Funktionen
            </button>
            <button onClick={() => onNavigateRoute('pricing')} className="hover:text-white">
              Preise
            </button>
            <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-white">
              OpenAPI 3.1
            </a>
            <a href="https://github.com/l3nnardwlg/agf-drawer" target="_blank" rel="noreferrer" className="hover:text-white">
              GitHub Repository
            </a>
            <button onClick={onOpenDashboard} className="text-[#0057FF] hover:underline font-medium">
              App / Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

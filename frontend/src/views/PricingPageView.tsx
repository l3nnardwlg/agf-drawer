import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  X,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Server
} from 'lucide-react';
import { AppRoute } from '../types';

interface PricingPageViewProps {
  onNavigateRoute: (route: AppRoute) => void;
  onOpenDashboard: () => void;
}

export const PricingPageView: React.FC<PricingPageViewProps> = ({
  onNavigateRoute,
  onOpenDashboard,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const faqs = [
    {
      q: 'Kann ich AGF Drawer komplett auf meiner eigenen Hardware betreiben?',
      a: 'Ja, absolut! Das gesamte System ist mit Docker Compose containerisiert und läuft out-of-the-box auf Raspberry Pi, Proxmox, Unraid oder Linux-Servern mit vollem Funktionsumfang.',
    },
    {
      q: 'Gibt es eine Begrenzung für die Anzahl an Kabeln oder Steckern?',
      a: 'Nein. Weder im Community- noch im Studio-Plan existieren künstliche Beschränkungen für Kabel, Anschlüsse oder Schubladen.',
    },
    {
      q: 'Wie funktioniert die symmetrische Suche?',
      a: 'Unser Backend indexiert Stecker-Paare richtungsunabhängig. Suchst du nach USB-C auf HDMI, matcht das System sowohl USB-C → HDMI als auch HDMI → USB-C ohne Fehlversuche.',
    },
    {
      q: 'Welche Etikettendrucker und Formate werden unterstützt?',
      a: 'Wir unterstützen Dymo, Brother, Zebra sowie gängige Etikettenbögen über browserbasierten Druck (54x25mm, 38x19mm und Mini-QR-Codes).',
    },
    {
      q: 'Kann ich meine Daten jederzeit exportieren?',
      a: 'Ja. Du kannst dein gesamtes Inventar jederzeit per CSV oder über die OpenAPI 3.1 REST-Schnittstelle vollständig exportieren.',
    },
  ];

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
            onClick={() => onNavigateRoute('features')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white"
          >
            Funktionen
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
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono text-[#0057FF] uppercase tracking-wider">
            Faire & transparente Preise
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-white font-normal">
            Pläne für jedes Setup.
          </h1>
          <p className="text-sm text-neutral-400">
            Vom Bastler mit Homelab bis zum professionellen Broadcast-Studio.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs">
            <span className={billingCycle === 'monthly' ? 'text-white font-medium' : 'text-neutral-400'}>
              Monatlich
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-neutral-900 border border-neutral-700 p-0.5 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#0057FF] transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={billingCycle === 'yearly' ? 'text-white font-medium flex items-center gap-1.5' : 'text-neutral-400'}>
              Jährlich
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                -20% Rabatt
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="p-7 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">Community / Self-Host</span>
                <div className="mt-3 text-3xl font-bold text-white">0 €</div>
                <div className="text-xs text-neutral-400 mt-1">Dauerhaft kostenlos</div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ideal für private Homelabs, Bastler und Maker, die ihre Werkstatt selbst hosten.
              </p>
              <ul className="space-y-3 text-xs text-neutral-300 pt-2 border-t border-neutral-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unbegrenzte Kabel & Anschlüsse</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Workspace (Homelab)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Schrankansicht & Schubladen</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Vollständiger Docker-Compose Stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>REST API & OpenAPI 3.1</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenDashboard}
              className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              Jetzt starten
            </button>
          </div>

          {/* Pro Studio Tier */}
          <div className="p-7 rounded-3xl bg-neutral-950 border border-[#0057FF] shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-8 relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#0057FF] text-white text-[10px] font-mono font-bold tracking-wider">
              EMPFEHLUNG
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase">Pro Studio</span>
                <div className="mt-3 text-3xl font-bold text-white">
                  {billingCycle === 'yearly' ? '9,60 €' : '12,00 €'}
                  <span className="text-xs font-normal text-neutral-400"> / Monat</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {billingCycle === 'yearly' ? 'Jährlich abgerechnet (115,20 €/Jahr)' : 'Monatlich kündbar'}
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Für professionelle Tonstudios, Werkstätten, Creator und Technik-Teams.
              </p>
              <ul className="space-y-3 text-xs text-neutral-300 pt-2 border-t border-neutral-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Bis zu 5 isolierte Workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>10 Teammitglieder & Rollen (RBAC)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>QR-Code & Etikettendruck</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Lückenloses Audit & Bewegungslog</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Tägliche Cloud-Backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Priority E-Mail Support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenDashboard}
              className="w-full py-3 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all"
            >
              14 Tage kostenlos testen
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="p-7 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">Enterprise</span>
                <div className="mt-3 text-3xl font-bold text-white">ab 49 €</div>
                <div className="text-xs text-neutral-400 mt-1">Maßgeschneidert</div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Für Verleiher, Medienhäuser, Hochschulen und Rechenzentren mit individuellen Anforderungen.
              </p>
              <ul className="space-y-3 text-xs text-neutral-300 pt-2 border-t border-neutral-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Unbegrenzte Workspaces & Mitglieder</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>SAML / SSO & LDAP Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Dedizierter Postgres-Cluster</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Compliance- & Revisions-Audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>99.9% SLA & 24/7 Notfallsupport</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => alert('Vielen Dank! Unser Team wird sich in Kürze bei dir melden.')}
              className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              Enterprise anfragen
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-12 border-t border-neutral-900 space-y-8">
          <div className="text-center">
            <h2 className="font-editorial text-2xl sm:text-3xl text-white">
              Häufig gestellte Fragen (FAQ)
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Alles Wissenswerte über Bereitstellung, Lizenzen und Workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black py-8 px-6 text-center text-xs text-neutral-500">
        AGF Drawer • Keine versteckten Kosten. Volle Datenkontrolle.
      </footer>
    </div>
  );
};

import React from 'react';
import { ArrowLeft, Shield, Building, Mail, Phone, Scale } from 'lucide-react';
import { AppRoute } from '../types';

interface ImpressumViewProps {
  onNavigateRoute: (route: AppRoute) => void;
  onOpenDashboard?: () => void;
}

export const ImpressumView: React.FC<ImpressumViewProps> = ({
  onNavigateRoute,
}) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0057FF] selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-neutral-900/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigateRoute('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-mono font-bold text-xs text-white group-hover:border-neutral-700 transition-colors">
                AGF
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight text-white block">AGF Drawer</span>
                <span className="font-mono text-[10px] text-neutral-400 block -mt-0.5">by AGF Studios</span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-5 text-xs text-neutral-400 font-medium">
              <button onClick={() => onNavigateRoute('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => onNavigateRoute('pricing')} className="hover:text-white transition-colors">Preise</button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateRoute('landing')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Startseite</span>
            </button>
            <button
              onClick={() => onNavigateRoute('login')}
              className="px-3 py-1.5 rounded-xl bg-[#0057FF] hover:bg-blue-600 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all"
            >
              Anmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-16 space-y-10">
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Angaben gemäß § 5 DDG</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif">
            Impressum
          </h1>
          <p className="text-sm text-neutral-400">
            Rechtliche Anbieterkennzeichnung und Unternehmensangaben der AGF-Studios GmbH.
          </p>
        </div>

        {/* Content Card Panel */}
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 md:p-10 space-y-8 shadow-xl">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0057FF]" />
              Diensteanbieter
            </h2>
            <div className="font-mono text-xs text-neutral-300 leading-relaxed bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/70">
              AGF-Studios GmbH<br />
              Strandstraße 37<br />
              17449 Trassenheide<br />
              Deutschland
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Sitz der Gesellschaft</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Strandstraße 37<br />
              17449 Trassenheide<br />
              Deutschland
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Vertretungsberechtigte Person</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Vertreten durch den Geschäftsführer:<br />
              <strong className="text-white">Jens Reule</strong>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Gültige Websites</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dieses Impressum gilt für folgende von der AGF-Studios GmbH betriebene Websites und Dienste:<br />
              <span className="font-mono text-neutral-300">
                *.agf-studios.com • agf-studios.com • app.studyfloww.com • free-tools.uk • build-attack.com • drawer.agf-studios.com
              </span>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0057FF]" />
              Kontakt
            </h2>
            <div className="text-xs text-neutral-300 space-y-1.5">
              <div>
                <span className="text-neutral-500 font-mono">Telefon: </span>
                <a href="tel:+4915167431271" className="text-blue-400 hover:underline font-mono">
                  +49 151 67431271
                </a>
              </div>
              <div>
                <span className="text-neutral-500 font-mono">E-Mail: </span>
                <a href="mailto:kontakt@agf-studios.com" className="text-blue-400 hover:underline font-mono">
                  kontakt@agf-studios.com
                </a>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Handelsregister</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Registergericht: <span className="text-white">Amtsgericht Stralsund</span><br />
              Handelsregisternummer: <span className="font-mono text-white">HRB 23289</span>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Stammkapital</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Stammkapital: <span className="font-mono text-white">25.000,00 €</span><br />
              Ausstehende Einlagen: Keine ausstehenden Einlagen
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Steuerliche Angaben</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: <span className="font-mono text-neutral-400">Antrag gestellt</span><br />
              Wirtschafts-Identifikationsnummer gemäß § 139c AO: <span className="font-mono text-neutral-400">Antrag gestellt</span>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">Verantwortlich für journalistisch-redaktionelle Inhalte</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Verantwortlich im Sinne des § 18 Abs. 2 MStV:<br />
              <strong className="text-white">Jens Reule</strong><br />
              Strandstraße 37, 17449 Trassenheide, Deutschland
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-900 pt-6">
            <h2 className="text-base font-bold text-white">Verbraucherstreitbeilegung</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900/80 bg-neutral-950 py-10 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div>© 2026 AGF-Studios GmbH. Alle Rechte vorbehalten.</div>
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <button onClick={() => onNavigateRoute('impressum')} className="text-white hover:text-white transition-colors">Impressum</button>
            <button onClick={() => onNavigateRoute('datenschutz')} className="hover:text-white transition-colors">Datenschutz</button>
            <button onClick={() => onNavigateRoute('agb')} className="hover:text-white transition-colors">AGB</button>
            <button onClick={() => onNavigateRoute('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => onNavigateRoute('pricing')} className="hover:text-white transition-colors">Preise</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

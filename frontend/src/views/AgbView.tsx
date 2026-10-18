import React from 'react';
import { ArrowLeft, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { AppRoute } from '../types';

interface AgbViewProps {
  onNavigateRoute: (route: AppRoute) => void;
  onOpenDashboard?: () => void;
}

export const AgbView: React.FC<AgbViewProps> = ({
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
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Allgemeine Geschäftsbedingungen der AGF Studios • Fassung 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-sm text-neutral-400">
            Vertragsbedingungen für die Nutzung der AGF Drawer SaaS-Plattform und Dienstleistungen der AGF-Studios GmbH.
          </p>
        </div>

        {/* Content Card Panel */}
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 md:p-10 space-y-8 shadow-xl text-xs md:text-sm text-neutral-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 1</span>
              Geltungsbereich und Anbieter
            </h2>
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB“) regeln die vertraglichen Beziehungen zwischen der <strong className="text-white">AGF-Studios GmbH</strong> (nachfolgend „Anbieter“) und ihren Kunden (nachfolgend „Kunde“ oder „Nutzer“) für die Nutzung der Software-as-a-Service-Plattform <em>AGF Drawer</em> sowie aller damit verbundenen Cloud-Dienste, Schnittstellen (APIs) und IT-Lösungen.
            </p>
            <p>
              (2) Abweichende oder entgegenstehende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 2</span>
              Leistungsumfang und Vertragsabschluss
            </h2>
            <p>
              (1) Der Anbieter stellt dem Kunden eine mandantenfähige Cloud-Plattform zur Erfassung, Verwaltung, Lokalisierung und Inventarisierung von Kabeln, Hardware, Elektronikkomponenten und Lagerplätzen über eine Weboberfläche und REST-APIs zur Verfügung.
            </p>
            <p>
              (2) Die Präsentation der Dienstleistungen auf der Website stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar. Durch den Abschluss des Registrierungs- oder Checkout-Prozesses gibt der Kunde ein verbindliches Vertragsangebot ab. Der Vertrag kommt mit der Freischaltung des Benutzerkontos bzw. der Bereitstellung des Workspaces zustande.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 3</span>
              Abrechnungsmodelle und Zahlungsbedingungen
            </h2>
            <p>
              (1) Der Anbieter unterscheidet je nach gewähltem Tarif zwischen verschiedenen Bereitstellungs- und Abrechnungsmodellen:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-300">
              <li><strong className="text-white">Free / Starter:</strong> Dauerhaft kostenlose Basisfunktionen mit limitierten Kontingenten ohne automatische Sperrung.</li>
              <li><strong className="text-white">Pro / Team (Managed):</strong> Monatliche oder jährliche Abonnement-Abrechnung mit automatischer Rechnungsstellung und Zahlungsüberwachung.</li>
              <li><strong className="text-white">Enterprise / On-Premise:</strong> Individuelle Abrechnung nach Vereinbarung oder jährlicher Lizenzvertrag.</li>
            </ul>
            <p>
              (2) Alle vereinbarten Preise verstehen sich, sofern nicht anders ausgewiesen, als Nettopreise zuzüglich der jeweils geltenden gesetzlichen Umsatzsteuer. Gebühren sind im Voraus zur Zahlung fällig. Die Zahlung erfolgt über die im Portal angebotenen Methoden (z. B. Stripe, Kreditkarte, SEPA).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 4</span>
              Sperrung und Kündigung
            </h2>
            <p>
              (1) Ist der Kunde mit fälligen Zahlungen in Verzug, ist der Anbieter berechtigt, nach vorheriger Mahnung und Fristsetzung den Zugriff auf den Workspace vorübergehend zu sperren. Die Daten bleiben für einen Kulanzzeitraum von 14 Tagen nach Sperrung zur Wiederherstellung erhalten, bevor eine endgültige Bereinigung erfolgen kann.
            </p>
            <p>
              (2) Monatlich kündbare Tarife können von beiden Parteien mit einer Frist von 14 Tagen zum Ende des laufenden Abrechnungszeitraums gekündigt werden. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 5</span>
              Pflichten des Kunden und Datensicherheit
            </h2>
            <p>
              (1) Der Kunde verpflichtet sich, die bereitgestellten Ressourcen nicht für rechtswidrige Zwecke zu nutzen. Untersagt sind Angriffe auf die Infrastruktur (z. B. DDoS, Vulnerability-Scans), Missbrauch von Schnittstellen sowie die Speicherung unzulässiger oder schadsoftwarebehafteter Daten.
            </p>
            <p>
              (2) Der Kunde ist für die sorgfältige Aufbewahrung seiner Zugangsdaten und die Vergabe angemessener Berechtigungen an eingeladene Workspace-Mitglieder selbst verantwortlich.
            </p>
            <p>
              (3) Der Kunde ist angehalten, wichtige Bestandsdaten regelmäßig über die integrierte CSV-/Exportfunktion zu sichern. Die serverseitigen Backups des Anbieters dienen der systemweiten Notfallwiederherstellung und ersetzen keine eigene Archivierung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 6</span>
              Haftungsbeschränkung
            </h2>
            <p>
              (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung beruhen.
            </p>
            <p>
              (2) Bei sonstigen Schäden haftet der Anbieter nur für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht). In diesem Fall ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
            </p>
          </section>

          <section className="space-y-2 border-t border-neutral-900 pt-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">§ 7</span>
              Schlussbestimmungen
            </h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).
            </p>
            <p>
              (2) Ist der Kunde Kaufmann im Sinne des Handelsgesetzbuches, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, so ist der Geschäftssitz des Anbieters ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900/80 bg-neutral-950 py-10 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div>© 2026 AGF-Studios GmbH. Alle Rechte vorbehalten.</div>
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <button onClick={() => onNavigateRoute('impressum')} className="hover:text-white transition-colors">Impressum</button>
            <button onClick={() => onNavigateRoute('datenschutz')} className="hover:text-white transition-colors">Datenschutz</button>
            <button onClick={() => onNavigateRoute('agb')} className="text-white hover:text-white transition-colors">AGB</button>
            <button onClick={() => onNavigateRoute('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => onNavigateRoute('pricing')} className="hover:text-white transition-colors">Preise</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

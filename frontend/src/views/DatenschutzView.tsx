import React from 'react';
import { ArrowLeft, Shield, Lock, Database, Server, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { AppRoute } from '../types';

interface DatenschutzViewProps {
  onNavigateRoute: (route: AppRoute) => void;
  onOpenDashboard?: () => void;
}

export const DatenschutzView: React.FC<DatenschutzViewProps> = ({
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
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Informationen gemäß DSGVO & TDDDG • Stand: August 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif">
            Datenschutzerklärung
          </h1>
          <p className="text-sm text-neutral-400">
            Informationen zum Schutz Ihrer persönlichen Daten bei der Nutzung von AGF Drawer und den Diensten der AGF-Studios GmbH.
          </p>
        </div>

        {/* Content Card Panel */}
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 md:p-10 space-y-8 shadow-xl text-xs md:text-sm text-neutral-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">01.</span>
              Datenschutz auf einen Blick
            </h2>
            <p>
              Diese Datenschutzerklärung informiert darüber, welche personenbezogenen Daten die AGF-Studios GmbH bei der Nutzung ihrer Websites, Plattformen, Produkte und Subprodukte verarbeitet, zu welchen Zwecken dies geschieht, auf welchen Rechtsgrundlagen die Verarbeitung beruht und welche Rechte betroffene Personen haben.
            </p>
            <p>
              Welche Daten konkret verarbeitet werden, hängt vom jeweils verwendeten Dienst und dessen Funktionen ab. Personenbezogene Daten können insbesondere Namen, E-Mail-Adressen, Telefonnummern, IP-Adressen, Accountdaten, technische Sicherheitskennungen und nutzerbezogene Inhaltsdaten umfassen.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">02.</span>
              Verantwortlicher und Geltungsbereich
            </h2>
            <div className="font-mono text-xs bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/70">
              <strong className="text-white">AGF-Studios GmbH</strong><br />
              Strandstraße 37<br />
              17449 Trassenheide<br />
              Deutschland<br />
              E-Mail: <a href="mailto:datenschutz@agf-studios.com" className="text-blue-400 hover:underline">datenschutz@agf-studios.com</a>
            </div>
            <p className="text-neutral-400">
              Ein behördlicher Datenschutzbeauftragter ist nach den gesetzlichen Bestimmungen derzeit nicht bestellt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">03.</span>
              Rechtsgrundlagen der Verarbeitung
            </h2>
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit hierfür eine Rechtsgrundlage besteht. Je nach Verarbeitung kommen insbesondere Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. b DSGVO (Vertrag und vorvertragliche Maßnahmen), Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen) in Betracht.
            </p>
            <p>
              Unsere berechtigten Interessen umfassen insbesondere den sicheren und stabilen Betrieb unserer Dienste, die Erkennung und Abwehr von Cyberangriffen, Betrugs- und Missbrauchsprävention, Fehleranalyse sowie die Geltendmachung und Verteidigung rechtlicher Ansprüche.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">04.</span>
              Hosting, Cloudflare und Serverlogs
            </h2>
            <p>
              Unsere Dienste werden überwiegend auf von uns administrierter Infrastruktur innerhalb der Europäischen Union betrieben. Hierfür nutzen wir insbesondere Leistungen der Hetzner Online GmbH sowie Rechenzentren in Deutschland und Helsinki, Finnland.
            </p>
            <p>
              Öffentlich erreichbare Domains werden grundsätzlich über Cloudflare für DNS, Reverse-Proxy-Funktionen und DDoS-Schutz bereitgestellt. Dabei können insbesondere IP-Adresse, Zeitpunkt, angeforderte Ressourcen, technische Request-, Netzwerk- und Sicherheitsinformationen verarbeitet werden. Reguläre Server- und Loginlogs werden grundsätzlich bis zu 30 Tage gespeichert.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">05.</span>
              IT-Sicherheit und Sicherheitsprotokollierung
            </h2>
            <p>
              Zum Schutz unserer Systeme setzen wir unter anderem CrowdSec, Fail2ban, Loki, Grafana sowie eigene Security- und Monitoring-Systeme ein. Diese können IP-Adressen, Zugriffszeitpunkte, Angriffsindikatoren, Fehlversuche und weitere sicherheitsrelevante Metadaten verarbeiten.
            </p>
            <p>
              Nicht dauerhaft relevante Security-Informationen werden grundsätzlich nach sieben Tagen entfernt. IP-Adressen, von denen erhebliche Angriffe oder Missbrauch ausgegangen sind, können in Sperrlisten gespeichert werden, soweit dies zur Gefahrenabwehr erforderlich ist.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">06.</span>
              AGF Device ID (DID)
            </h2>
            <p>
              Zur Erkennung und Abwehr von Betrug, automatisierten Angriffen, missbräuchlichen Mehrfachaktivitäten und der Umgehung technischer Sicherheitsmaßnahmen verwenden wir eine pseudonyme technische Sicherheitskennung („AGF Device ID“ bzw. „DID“).
            </p>
            <p>
              Die DID wird rein serverseitig aus technischen Merkmalen abgeleitet, die im Rahmen der Kommunikation anfallen (z. B. TLS-Verbindungsmerkmale, Request-Merkmale). Es wird kein clientseitiges Browser-Fingerprinting (Canvas, WebGL, Fonts) und kein Auslesen von MAC-Adressen eingesetzt. Die DID wird nicht für Werbezwecke verwendet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">07.</span>
              Benutzerkonten, Authentifizierung & Passwörter
            </h2>
            <p>
              Im Rahmen der Registrierung und Authentifizierung verarbeiten wir Benutzername, Anzeigename, E-Mail-Adresse und Passwort. Passwörter werden niemals im Klartext gespeichert, sondern mittels des modernen, kryptografisch resistenten <strong className="text-white font-mono">Argon2id</strong> Verfahrens gehasht.
            </p>
            <p>
              Sitzungen werden über serverseitig verifizierte Datenbank-Tokens mit <strong className="text-white font-mono">HttpOnly, Secure und SameSite</strong> Cookies verwaltet, um unbefugten Zugriff durch clientseitige Skripte oder CSRF-Angriffe zu verhindern.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">08.</span>
              Zahlungsabwicklung und Buchhaltung
            </h2>
            <p>
              Für kostenpflichtige Tarife und Abonnements setzen wir Zahlungsdienstleister wie Stripe und PayPal ein. Vollständige Kreditkarten- und Bankverbindungsdaten werden unmittelbar durch die PCI-DSS-zertifizierten Zahlungsdienstleister verarbeitet und nicht dauerhaft von AGF gespeichert. Buchhaltungsrelevante Belegdaten werden gemäß den gesetzlichen Aufbewahrungsfristen (HGB/AO) archiviert.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">09.</span>
              Backups und Verschlüsselung
            </h2>
            <p>
              Sicherheitskopien (Backups) werden mit starker <strong className="text-white font-mono">AES-256-Verschlüsselung</strong> geschützt und grundsätzlich bis zu 90 Tage aufbewahrt. Der Zugriff ist organisatorisch auf autorisierte Systemadministratoren beschränkt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">10.</span>
              Speicherdauern im Überblick
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
              <li><strong className="text-white">Server- und Loginlogs:</strong> bis zu 30 Tage</li>
              <li><strong className="text-white">Sicherheits-Kurzzeitdaten:</strong> 7 Tage</li>
              <li><strong className="text-white">Supportanfragen:</strong> 90 Tage nach Erledigung</li>
              <li><strong className="text-white">Verschlüsselte Backups:</strong> bis zu 90 Tage</li>
              <li><strong className="text-white">Aktive Kontodaten:</strong> für die Dauer des bestehenden Vertragsverhältnisses</li>
              <li><strong className="text-white">Steuer- und Rechnungsdaten:</strong> gemäß gesetzlicher Aufbewahrungspflichten (bis zu 10 Jahre)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">11.</span>
              Ihre Rechte als betroffene Person
            </h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie das Recht auf Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO).
            </p>
            <p>
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an: <a href="mailto:datenschutz@agf-studios.com" className="text-blue-400 hover:underline font-mono">datenschutz@agf-studios.com</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">12.</span>
              Zuständige Aufsichtsbehörde
            </h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Die für uns zuständige Behörde ist:
            </p>
            <div className="font-mono text-xs bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/70 text-neutral-300">
              <strong className="text-white">Der Landesbeauftragte für Datenschutz und Informationsfreiheit Mecklenburg-Vorpommern</strong><br />
              Schloss Schwerin, Lennéstraße 1<br />
              19053 Schwerin<br />
              Telefon: +49 385 59494 0
            </div>
          </section>

          <section className="space-y-3 border-t border-neutral-900 pt-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-mono text-blue-400">13.</span>
              Keine Datenverkäufe & kein Training von KI-Modellen
            </h2>
            <p>
              Die AGF-Studios GmbH verkauft keinerlei personenbezogene Daten. Ihre Inventardaten, Bestände, Notizen und Kabeldaten werden nicht zu Werbezwecken verwendet und keinesfalls für das Training externer oder allgemeiner KI-Modelle herangezogen.
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
            <button onClick={() => onNavigateRoute('datenschutz')} className="text-white hover:text-white transition-colors">Datenschutz</button>
            <button onClick={() => onNavigateRoute('agb')} className="hover:text-white transition-colors">AGB</button>
            <button onClick={() => onNavigateRoute('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => onNavigateRoute('pricing')} className="hover:text-white transition-colors">Preise</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

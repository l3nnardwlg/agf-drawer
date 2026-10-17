import React, { useState } from 'react';
import {
  User,
  Building,
  Palette,
  Shield,
  Key,
  Printer,
  Sliders,
  Check,
  Save,
  RotateCcw,
  Mail,
  Users
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState('Lennard');
  const [email, setEmail] = useState('lennard@agf-studios.de');
  const [workspaceName, setWorkspaceName] = useState('AGF Studios');
  const [workspaceSlug, setWorkspaceSlug] = useState('agf-studios');
  const [themePreference, setThemePreference] = useState<'dark' | 'light' | 'system'>('dark');
  const [labelSize, setLabelSize] = useState('54x25');

  const tabs = [
    { id: 'profile', label: 'Profil & Konto', icon: <User className="w-4 h-4" /> },
    { id: 'workspace', label: 'Workspace & Mitglieder', icon: <Building className="w-4 h-4" /> },
    { id: 'appearance', label: 'Design & Darstellung', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: 'Sicherheit & Sessions', icon: <Shield className="w-4 h-4" /> },
    { id: 'labels', label: 'Etiketten & QR-Codes', icon: <Printer className="w-4 h-4" /> },
    { id: 'api', label: 'API & Integrationen', icon: <Key className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Einstellungen</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Verwalte deine persönlichen Einstellungen, Workspaces, Berechtigungen und Schnittstellen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white border border-neutral-800 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                <span className={isActive ? 'text-[#0057FF]' : 'text-neutral-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white">Profilinformationen</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center font-bold text-lg text-white">
                    LW
                  </div>
                  <div>
                    <button className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-white hover:bg-neutral-800">
                      Avatar ändern
                    </button>
                    <p className="text-[11px] text-neutral-500 mt-1">JPG, PNG oder GIF (max. 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      Anzeigename
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-white">Workspace Details</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Alle Kabel und Lagerorte sind diesem Mandanten zugeordnet.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Slug / URL-Pfad
                  </label>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-white">Mitglieder & Rollen (RBAC)</h3>
                  <button className="px-3 py-1 bg-[#0057FF] text-white text-xs font-medium rounded-lg">
                    + Einladen
                  </button>
                </div>

                <div className="divide-y divide-neutral-900 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white text-xs">
                        LW
                      </div>
                      <div>
                        <div className="font-medium text-white">Lennard (Du)</div>
                        <div className="text-neutral-500 text-[11px]">lennard@agf-studios.de</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-900 font-mono text-[10px]">
                      Owner
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white text-xs">
                        JR
                      </div>
                      <div>
                        <div className="font-medium text-white">Jens</div>
                        <div className="text-neutral-500 text-[11px]">jens@agf-studios.de</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono text-[10px]">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white">Darstellung & Thema</h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setThemePreference('dark')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    themePreference === 'dark'
                      ? 'bg-neutral-900 border-[#0057FF] ring-1 ring-[#0057FF]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-white">Dunkel (Default)</span>
                </button>
                <button
                  onClick={() => setThemePreference('light')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    themePreference === 'light'
                      ? 'bg-neutral-900 border-[#0057FF] ring-1 ring-[#0057FF]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-neutral-300 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-white">Hell (Tagmodus)</span>
                </button>
                <button
                  onClick={() => setThemePreference('system')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    themePreference === 'system'
                      ? 'bg-neutral-900 border-[#0057FF] ring-1 ring-[#0057FF]'
                      : 'bg-neutral-900/40 border-neutral-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-black to-white border border-neutral-600 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-white">System</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white">Sicherheit & Authentifizierung</h2>
              <p className="text-xs text-neutral-400">
                Argon2id Hashverfahren, serverseitige Sessions mit HttpOnly Cookies und CSRF-Schutz sind aktiv.
              </p>
              <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-medium">Aktive Browsersitzung</div>
                  <div className="text-neutral-500 font-mono text-[11px]">Windows • Chrome 130 • 127.0.0.1</div>
                </div>
                <span className="text-emerald-400 font-mono">Aktuell aktiv</span>
              </div>
            </div>
          )}

          {activeTab === 'labels' && (
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white">Etikettendruck & QR-Codes</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Standard Etikettengröße
                  </label>
                  <select
                    value={labelSize}
                    onChange={(e) => setLabelSize(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                  >
                    <option value="54x25">54 × 25 mm (Dymo / Brother Standard)</option>
                    <option value="38x19">38 × 19 mm (Kompaktkabel)</option>
                    <option value="12x12">12 × 12 mm (Micro QR-Code Flagge)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white">Fastify REST API & OpenAPI 3.1</h2>
              <p className="text-xs text-neutral-400">
                Die OpenAPI 3.1 Spezifikation steht live unter <code className="text-blue-400">/docs</code> zur Verfügung.
              </p>
              <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300">
                Base URL: http://localhost:3000/api/v1
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 flex items-center justify-between max-w-5xl mx-auto z-20">
        <span className="text-xs text-neutral-400">Ungespeicherte Änderungen werden automatisch validiert.</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-xs font-semibold text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Gespeichert!' : 'Änderungen speichern'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

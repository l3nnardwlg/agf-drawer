import React, { useState, useEffect } from 'react';
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
  Users,
  LogOut,
  Sparkles
} from 'lucide-react';
import { UserSession } from '../types';

interface SettingsViewProps {
  currentUser?: UserSession | null;
  isLightMode?: boolean;
  onToggleLightMode?: (mode: 'dark' | 'light') => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  isLightMode = false,
  onToggleLightMode,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Form states populated from currentUser
  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Lennard');
  const [email, setEmail] = useState(currentUser?.email || 'lennard@agf-studios.de');
  const [workspaceName, setWorkspaceName] = useState(currentUser?.workspaceName || 'AGF Studios');
  const [workspaceSlug, setWorkspaceSlug] = useState('agf-studios');
  const [labelSize, setLabelSize] = useState('54x25');

  useEffect(() => {
    if (currentUser?.displayName) setDisplayName(currentUser.displayName);
    if (currentUser?.email) setEmail(currentUser.email);
    if (currentUser?.workspaceName) setWorkspaceName(currentUser.workspaceName);
  }, [currentUser]);

  const initials = displayName
    ? displayName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AG';

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
        <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
          Einstellungen
        </h1>
        <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
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
                    ? isLightMode
                      ? 'bg-white text-neutral-900 border border-neutral-200 shadow-xs'
                      : 'bg-neutral-900 text-white border border-neutral-800 shadow-sm'
                    : isLightMode
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                <span className={isActive ? 'text-[#0057FF]' : isLightMode ? 'text-neutral-500' : 'text-neutral-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className={`rounded-3xl border p-6 space-y-5 ${
              isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80 shadow-md'
            }`}>
              <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Profilinformationen
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full border flex items-center justify-center font-bold text-lg font-mono ${
                    isLightMode
                      ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                      : 'bg-gradient-to-tr from-neutral-800 to-neutral-700 border-neutral-600 text-white'
                  }`}>
                    {initials}
                  </div>
                  <div>
                    <button className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      isLightMode
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
                        : 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800'
                    }`}>
                      Avatar ändern
                    </button>
                    <p className={`text-[11px] mt-1 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      JPG, PNG oder GIF (max. 2MB)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLightMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      Anzeigename
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-[#0057FF] ${
                        isLightMode
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                          : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLightMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-[#0057FF] ${
                        isLightMode
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                          : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <div className={`rounded-3xl border p-6 space-y-6 ${
              isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80 shadow-md'
            }`}>
              <div>
                <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                  Workspace Details
                </h2>
                <p className={`text-xs mt-0.5 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Alle Kabel und Lagerorte sind diesem Mandanten zugeordnet.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLightMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-[#0057FF] ${
                      isLightMode
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        : 'bg-neutral-900 border-neutral-800 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLightMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    Slug / URL-Pfad
                  </label>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:outline-none focus:border-[#0057FF] ${
                      isLightMode
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        : 'bg-neutral-900 border-neutral-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className={`pt-4 border-t ${isLightMode ? 'border-neutral-200' : 'border-neutral-900'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-xs font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                    Mitglieder & Rollen (RBAC)
                  </h3>
                  <button className="px-3 py-1 bg-[#0057FF] hover:bg-blue-600 text-white text-xs font-medium rounded-lg">
                    + Einladen
                  </button>
                </div>

                <div className={`divide-y text-xs ${isLightMode ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isLightMode ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-800 text-white'
                      }`}>
                        {initials}
                      </div>
                      <div>
                        <div className={`font-medium ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {displayName} (Du)
                        </div>
                        <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {email}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[#0057FF] border border-blue-500/20 font-mono text-[10px]">
                      Owner
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isLightMode ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-800 text-white'
                      }`}>
                        LW
                      </div>
                      <div>
                        <div className={`font-medium ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          Lennard
                        </div>
                        <div className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          lennard@agf-studios.de
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                      isLightMode ? 'bg-neutral-100 text-neutral-700 border-neutral-200' : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                    }`}>
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className={`rounded-3xl border p-6 space-y-4 ${
              isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80 shadow-md'
            }`}>
              <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Darstellung & Thema
              </h2>
              <p className={`text-xs ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Wähle dein bevorzugtes Farbschema für die AGF Drawer Benutzeroberfläche.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => onToggleLightMode?.('dark')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    !isLightMode
                      ? 'bg-neutral-900 border-[#0057FF] ring-2 ring-[#0057FF]'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-black border border-neutral-700 mx-auto mb-2 flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 rounded-full bg-[#0057FF]" />
                  </div>
                  <span className={`text-xs font-semibold block ${!isLightMode ? 'text-white' : 'text-neutral-800'}`}>
                    Dunkel (Standard)
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">
                    Optimiert für Studio & Racks
                  </span>
                </button>

                <button
                  onClick={() => onToggleLightMode?.('light')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    isLightMode
                      ? 'bg-blue-50/50 border-[#0057FF] ring-2 ring-[#0057FF]'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-neutral-300 mx-auto mb-2 flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 rounded-full bg-[#0057FF]" />
                  </div>
                  <span className={`text-xs font-semibold block ${isLightMode ? 'text-neutral-900 font-bold' : 'text-white'}`}>
                    Hell (Tagmodus)
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">
                    Hoher Kontrast für Tageslicht
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className={`rounded-3xl border p-6 space-y-4 ${
              isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80 shadow-md'
            }`}>
              <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Sicherheit & Authentifizierung
              </h2>
              <p className={`text-xs ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Argon2id Hashverfahren, serverseitige Sessions mit HttpOnly Cookies und CSRF-Schutz sind aktiv.
              </p>
              <div className={`p-4 border rounded-xl flex items-center justify-between text-xs ${
                isLightMode ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/50 border-neutral-800'
              }`}>
                <div>
                  <div className={`font-medium ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                    Aktive Browsersitzung ({email})
                  </div>
                  <div className={`font-mono text-[11px] mt-0.5 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Angemeldet als {currentUser?.username || 'User'} • HttpOnly Cookie
                  </div>
                </div>
                <span className="text-emerald-500 font-mono font-semibold">Aktiv</span>
              </div>

              {onLogout && (
                <div className="pt-3">
                  <button
                    onClick={onLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#FF2020] border border-red-500/20 text-xs font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Von allen Geräten abmelden (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LABELS TAB */}
          {activeTab === 'labels' && (
            <div className={`rounded-3xl border p-6 space-y-4 ${
              isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80 shadow-md'
            }`}>
              <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Etikettendruck & QR-Codes
              </h2>
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLightMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    Standard Etikettengröße
                  </label>
                  <select
                    value={labelSize}
                    onChange={(e) => setLabelSize(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-xs ${
                      isLightMode
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        : 'bg-neutral-900 border-neutral-800 text-white'
                    }`}
                  >
                    <option value="54x25">54 × 25 mm (Dymo / Brother Standard)</option>
                    <option value="38x19">38 × 19 mm (Kompaktkabel)</option>
                    <option value="12x12">12 × 12 mm (Micro QR-Code Flagge)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* API TAB */}
          {activeTab === 'api' && (
            <div className={`rounded-3xl border p-6 space-y-4 ${
              isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-950 border-neutral-800/80 shadow-md'
            }`}>
              <h2 className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Fastify REST API & OpenAPI 3.1
              </h2>
              <p className={`text-xs ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Die OpenAPI 3.1 Dokumentation steht live unter <code className="text-[#0057FF]">/docs</code> zur Verfügung.
              </p>
              <div className={`p-3 border rounded-xl font-mono text-xs ${
                isLightMode ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-neutral-900/50 border-neutral-800 text-neutral-300'
              }`}>
                Base URL: http://localhost:3000/api/v1
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-md border-t flex items-center justify-between max-w-5xl mx-auto z-20 ${
        isLightMode
          ? 'bg-white/90 border-neutral-200 shadow-lg text-neutral-700'
          : 'bg-neutral-950/90 border-neutral-800 text-white'
      }`}>
        <span className={`text-xs ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
          Ungespeicherte Änderungen werden automatisch validiert.
        </span>
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

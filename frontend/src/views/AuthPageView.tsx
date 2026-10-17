import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { AppRoute, UserSession } from '../types';

interface AuthPageViewProps {
  initialMode?: 'login' | 'register';
  onNavigateRoute: (route: AppRoute) => void;
  onAuthSuccess: (session: UserSession) => void;
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({
  initialMode = 'login',
  onNavigateRoute,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('AGF Studios');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          onAuthSuccess({
            id: data.user?.id || 'usr-1',
            email: data.user?.email || email,
            username: data.user?.username || 'user',
            displayName: data.user?.displayName || 'Studio Member',
            workspaceName: 'AGF Studios',
          });
          onNavigateRoute('dashboard');
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMessage(errData.error?.message || 'Ungültige Anmeldedaten. Bitte prüfe E-Mail und Passwort.');
        }
      } else {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            username: username || email.split('@')[0],
            displayName: displayName || username || 'Studio User',
            workspaceName: workspaceName || 'Mein Workspace',
          }),
        });

        if (res.ok) {
          setSuccessMessage('Konto erfolgreich erstellt! Du wirst zum Dashboard weitergeleitet...');
          setTimeout(() => {
            onAuthSuccess({
              id: 'usr-new',
              email,
              username: username || email.split('@')[0],
              displayName: displayName || 'Studio User',
              workspaceName: workspaceName || 'Mein Workspace',
            });
            onNavigateRoute('dashboard');
          }, 1200);
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMessage(errData.error?.message || 'Registrierung fehlgeschlagen. Bitte versuche es erneut.');
        }
      }
    } catch (err) {
      // In case backend is not reached, provide friendly fallback
      setErrorMessage('Verbindung zum Server fehlgeschlagen. Nutze den Demo-Gastmodus zum sofortigen Testen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onAuthSuccess({
      id: 'demo-user',
      email: 'demo@agf-studios.de',
      username: 'lennard',
      displayName: 'Lennard (AGF Studios)',
      role: 'Owner',
      workspaceName: 'AGF Studios',
    });
    onNavigateRoute('dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0057FF] selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top bar */}
      <header className="p-6 flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigateRoute('landing')}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
          <KeyRound className="w-3.5 h-3.5 text-blue-400" />
          <span>Argon2id & HttpOnly Sessions</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Brand header */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white shadow-sm mx-auto">
              <span className="text-white text-sm font-mono tracking-tighter">AGF</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {mode === 'login' ? 'Willkommen zurück' : 'AGF Drawer Account erstellen'}
            </h1>
            <p className="text-xs text-neutral-400">
              {mode === 'login'
                ? 'Melde dich an, um auf deine Schränke und Kabel zuzugreifen.'
                : 'Starte jetzt deine strukturierte Werkstatt- & Kabelverwaltung.'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-colors ${
                mode === 'register'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Registrieren
            </button>
          </div>

          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-[#FF2020] shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Benutzername
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="z.B. lennard"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Anzeigename
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="z.B. Lennard"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Erster Workspace-Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="z.B. Homelab oder AGF Studios"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-semibold">
                  Passwort
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Bitte kontaktiere deinen Workspace-Administrator oder konfiguriere SMTP für automatischen Passwort-Reset.')}
                    className="text-[11px] text-[#0057FF] hover:underline"
                  >
                    Passwort vergessen?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 mt-2 bg-[#0057FF] hover:bg-blue-600 active:scale-98 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verarbeite...' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-neutral-900" />
            <span className="shrink-0 px-2 text-[10px] uppercase font-mono text-neutral-500">
              Oder ohne Registrierung
            </span>
            <div className="flex-grow border-t border-neutral-900" />
          </div>

          {/* One-Click Demo Mode Button */}
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Sofort als Demo-Gast starten (1-Klick)</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-neutral-500 relative z-10">
        AGF Studios • Sichere Authentifizierung mit Argon2id & Session Cookies
      </footer>
    </div>
  );
};

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
  KeyRound,
  Eye,
  EyeOff
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
  const [showPassword, setShowPassword] = useState(false);
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

    const cleanEmail = email.trim();
    const cleanPassword = password;

    try {
      if (mode === 'login') {
        // Fastify login schema expects: { login: string, password: string }
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: cleanEmail,
            password: cleanPassword,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          const session: UserSession = {
            id: data.user?.id || 'usr-' + Date.now(),
            email: data.user?.email || cleanEmail,
            username: data.user?.username || cleanEmail.split('@')[0],
            displayName: data.user?.displayName || cleanEmail.split('@')[0],
            role: data.user?.role || 'Owner',
            workspaceName: data.primaryWorkspaceId ? 'Mein Workspace' : 'AGF Studios',
          };
          localStorage.setItem('agf_drawer_user', JSON.stringify(session));
          onAuthSuccess(session);
          onNavigateRoute('dashboard');
        } else {
          setErrorMessage(
            data.error?.message ||
              'Ungültige Anmeldedaten. Bitte prüfe deine E-Mail / Benutzername und dein Passwort.'
          );
        }
      } else {
        // Password validation: min 8, uppercase, lowercase, number
        const hasUpper = /[A-Z]/.test(cleanPassword);
        const hasLower = /[a-z]/.test(cleanPassword);
        const hasNumber = /[0-9]/.test(cleanPassword);

        if (cleanPassword.length < 8 || !hasUpper || !hasLower || !hasNumber) {
          setErrorMessage(
            'Das Passwort muss mindestens 8 Zeichen lang sein und mind. einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.'
          );
          setIsLoading(false);
          return;
        }

        const safeUsername = (username || cleanEmail.split('@')[0])
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, '_');

        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPassword,
            username: safeUsername,
            displayName: (displayName || safeUsername).trim(),
            workspaceName: (workspaceName || 'AGF Studios').trim(),
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          setSuccessMessage('Konto erfolgreich erstellt! Du wirst zum Dashboard weitergeleitet...');
          const session: UserSession = {
            id: data.user?.id || 'usr-' + Date.now(),
            email: data.user?.email || cleanEmail,
            username: safeUsername,
            displayName: (displayName || safeUsername).trim(),
            role: 'Owner',
            workspaceName: (workspaceName || 'AGF Studios').trim(),
          };
          localStorage.setItem('agf_drawer_user', JSON.stringify(session));

          setTimeout(() => {
            onAuthSuccess(session);
            onNavigateRoute('dashboard');
          }, 900);
        } else {
          setErrorMessage(
            data.error?.message ||
              'Registrierung fehlgeschlagen. Möglicherweise existiert diese E-Mail bereits.'
          );
        }
      }
    } catch (err) {
      setErrorMessage(
        'Verbindung zum Backend-Server fehlgeschlagen. Bitte prüfe deine Internetverbindung oder versuche es in wenigen Augenblicken erneut.'
      );
    } finally {
      setIsLoading(false);
    }
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
          <span>Argon2id & Server-Session</span>
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
                ? 'Melde dich an, um auf deine Schränke und Bestände zuzugreifen.'
                : 'Erstelle dein persönliches SaaS-Konto für dein Team.'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
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
                setSuccessMessage(null);
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
                    Benutzername (alphanumerisch)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="z.B. lennard_studios"
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
                    Name des ersten Workspaces
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
                {mode === 'login' ? 'E-Mail oder Benutzername' : 'E-Mail-Adresse'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  placeholder={mode === 'login' ? 'name@beispiel.de oder benutzername' : 'name@beispiel.de'}
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
                    onClick={() =>
                      alert('Passwort-Reset: Bitte wende dich an deinen Administrator oder nutze die SMTP-Wiederherstellung.')
                    }
                    className="text-[11px] text-[#0057FF] hover:underline"
                  >
                    Passwort vergessen?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-[10px] text-neutral-500 mt-1">
                  Mind. 8 Zeichen mit mind. 1 Großbuchstabe, 1 Kleinbuchstabe und 1 Ziffer.
                </p>
              )}
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
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-neutral-500 relative z-10 flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto w-full gap-3 border-t border-neutral-900/60">
        <div>© 2026 AGF-Studios GmbH. Alle Rechte vorbehalten.</div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <button onClick={() => onNavigateRoute('impressum')} className="hover:text-white transition-colors">Impressum</button>
          <span>•</span>
          <button onClick={() => onNavigateRoute('datenschutz')} className="hover:text-white transition-colors">Datenschutz</button>
          <span>•</span>
          <button onClick={() => onNavigateRoute('agb')} className="hover:text-white transition-colors">AGB</button>
        </div>
      </footer>
    </div>
  );
};

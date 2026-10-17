import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Layers,
  Archive,
  PlugZap,
  History,
  Settings,
  Palette,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { ActiveView, UserSession } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  stats?: {
    cablesCount: number;
    inUseCount: number;
    storageCount: number;
  };
  currentWorkspace?: string;
  currentUser?: UserSession | null;
  onLogout?: () => void;
  isLightMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  stats = { cablesCount: 84, inUseCount: 19, storageCount: 7 },
  currentWorkspace = 'AGF Studios',
  currentUser,
  onLogout,
  isLightMode = false,
}) => {
  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'overview',
      label: 'Übersicht',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'cable-finder',
      label: 'Kabel-Finder',
      icon: <Compass className="w-4 h-4" />,
      badge: stats.cablesCount,
    },
    {
      id: 'storage',
      label: 'Lagerorte',
      icon: <Archive className="w-4 h-4" />,
      badge: stats.storageCount,
    },
    {
      id: 'in-use',
      label: 'In Verwendung',
      icon: <PlugZap className="w-4 h-4" />,
      badge: stats.inUseCount,
    },
    {
      id: 'inventory',
      label: 'Inventar',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'movements',
      label: 'Bewegungsverlauf',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'design-system',
      label: 'UI-Bibliothek',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = currentUser?.displayName || currentUser?.username || 'Lennard';
  const role = currentUser?.role || 'Owner';
  const initials = getInitials(displayName);

  return (
    <aside
      className={`w-64 flex flex-col justify-between shrink-0 h-screen select-none z-20 transition-colors ${
        isLightMode
          ? 'bg-white border-r border-neutral-200 text-neutral-900'
          : 'bg-black border-r border-neutral-800/80 text-white'
      }`}
    >
      {/* Top Header / Brand */}
      <div>
        <div
          className={`p-5 flex items-center justify-between border-b ${
            isLightMode ? 'border-neutral-200' : 'border-neutral-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm ${
                isLightMode
                  ? 'bg-neutral-100 border border-neutral-300 text-neutral-900'
                  : 'bg-neutral-900 border border-neutral-700 text-white'
              }`}
            >
              <span className="text-xs font-mono tracking-tighter">AGF</span>
            </div>
            <div>
              <div
                className={`font-semibold text-sm tracking-tight flex items-center gap-1.5 ${
                  isLightMode ? 'text-neutral-900' : 'text-white'
                }`}
              >
                AGF Drawer
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isLightMode
                      ? 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  v1.0
                </span>
              </div>
              <div
                className={`text-[11px] font-mono truncate max-w-[140px] ${
                  isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              >
                {currentWorkspace}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div
            className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
              isLightMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? isLightMode
                      ? 'bg-neutral-100 text-[#0057FF] font-semibold border border-neutral-200 shadow-xs'
                      : 'bg-neutral-900 text-white font-medium border border-neutral-800 shadow-sm'
                    : isLightMode
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#0057FF]' : isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? isLightMode
                          ? 'bg-blue-100 text-[#0057FF]'
                          : 'bg-neutral-800 text-neutral-200'
                        : isLightMode
                        ? 'bg-neutral-100 text-neutral-600'
                        : 'bg-neutral-900/80 text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div
        className={`p-4 border-t space-y-3 ${
          isLightMode ? 'border-neutral-200' : 'border-neutral-900'
        }`}
      >
        {/* Editorial Quote in Fraunces */}
        <div
          className={`px-3 py-2.5 rounded-xl border ${
            isLightMode
              ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
              : 'bg-neutral-950/80 border-neutral-900 text-neutral-400'
          }`}
        >
          <p className="font-editorial italic text-xs leading-relaxed">
            "Wissen, was du hast. Finden, was du brauchst."
          </p>
        </div>

        {/* User Profile Card */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border ${
            isLightMode
              ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
              : 'bg-neutral-900/40 border-neutral-800/60 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ${
                isLightMode
                  ? 'bg-neutral-200 border-neutral-300 text-neutral-800'
                  : 'bg-gradient-to-tr from-neutral-800 to-neutral-700 border-neutral-600 text-white'
              }`}
            >
              {initials}
            </div>
            <div className="overflow-hidden min-w-0">
              <div
                className={`text-xs font-medium truncate ${
                  isLightMode ? 'text-neutral-900' : 'text-white'
                }`}
              >
                {displayName}
              </div>
              <div
                className={`text-[10px] truncate ${
                  isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              >
                {role} • {currentWorkspace}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              title="Einstellungen"
              onClick={() => onNavigate('settings')}
              className={`p-1.5 rounded-lg transition-colors ${
                isLightMode
                  ? 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {onLogout && (
              <button
                title="Abmelden"
                onClick={onLogout}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLightMode
                    ? 'text-neutral-500 hover:text-red-600 hover:bg-neutral-200/60'
                    : 'text-neutral-400 hover:text-red-400 hover:bg-neutral-800'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

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
  LogOut,
  FolderSync
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  stats?: {
    cablesCount: number;
    inUseCount: number;
    storageCount: number;
  };
  currentWorkspace?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  stats = { cablesCount: 84, inUseCount: 19, storageCount: 7 },
  currentWorkspace = 'AGF Studios',
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

  return (
    <aside className="w-64 bg-black border-r border-neutral-800/80 flex flex-col justify-between shrink-0 h-screen select-none z-20">
      {/* Top Header / Brand */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white shadow-sm">
              <span className="text-white text-sm font-mono tracking-tighter">AGF</span>
            </div>
            <div>
              <div className="font-semibold text-sm text-white tracking-tight flex items-center gap-1.5">
                AGF Drawer
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">v1.0</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono truncate max-w-[140px]">{currentWorkspace}</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
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
                    ? 'bg-neutral-900 text-white font-medium border border-neutral-800 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#0057FF]' : 'text-neutral-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-neutral-800 text-neutral-200'
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
      <div className="p-4 border-t border-neutral-900 space-y-4">
        {/* Editorial Quote in Fraunces */}
        <div className="px-3 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-900">
          <p className="font-editorial italic text-xs text-neutral-400 leading-relaxed">
            "Wissen, was du hast. Finden, was du brauchst."
          </p>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center text-xs font-semibold text-white">
              LW
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-white truncate">Lennard</div>
              <div className="text-[10px] text-neutral-400 truncate">Owner • AGF Studios</div>
            </div>
          </div>
          <button
            title="Einstellungen"
            onClick={() => onNavigate('settings')}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

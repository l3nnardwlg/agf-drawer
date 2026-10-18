import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Archive,
  PlugZap,
  Settings,
  Plus
} from 'lucide-react';
import { ActiveView } from '../types';

interface MobileNavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenAddModal: () => void;
  isLightMode?: boolean;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  activeView,
  onNavigate,
  onOpenAddModal,
  isLightMode = false,
}) => {
  const items: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Übersicht', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'cable-finder', label: 'Finder', icon: <Compass className="w-5 h-5" /> },
    { id: 'storage', label: 'Lager', icon: <Archive className="w-5 h-5" /> },
    { id: 'in-use', label: 'In Nutzung', icon: <PlugZap className="w-5 h-5" /> },
    { id: 'settings', label: 'Mehr', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 py-1 flex items-center justify-around safe-area-pb border-t backdrop-blur-lg transition-colors ${
        isLightMode
          ? 'bg-white/95 border-neutral-200 text-neutral-900 shadow-md'
          : 'bg-neutral-950/95 border-neutral-800 text-white'
      }`}
    >
      {items.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
              isActive
                ? 'text-[#0057FF] font-semibold'
                : isLightMode
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}

      {/* Floating Add trigger on mobile */}
      <button
        onClick={onOpenAddModal}
        title="Kabel hinzufügen"
        className="fixed bottom-16 right-4 w-12 h-12 rounded-full bg-[#0057FF] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};

import React from 'react';
import { Search, Plus, Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { ActiveView } from '../types';

interface TopHeaderProps {
  activeView: ActiveView;
  breadcrumbs?: string[];
  onOpenCommandPalette: () => void;
  onOpenAddModal: () => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
  onOpenCatalogModal?: () => void;
  onNavigateLanding?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeView,
  breadcrumbs = ['Kabel-Finder', 'Alle Kabel'],
  onOpenCommandPalette,
  onOpenAddModal,
  isLightMode,
  onToggleLightMode,
  onOpenCatalogModal,
  onNavigateLanding,
}) => {
  return (
    <header className="h-16 border-b border-neutral-800/80 bg-black/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      {/* Left Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {onNavigateLanding ? (
          <button
            onClick={onNavigateLanding}
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 font-semibold"
          >
            <span>← Website</span>
          </button>
        ) : (
          <span className="text-neutral-500">AGF Drawer</span>
        )}
        <span className="text-neutral-700">/</span>
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={b}>
            <span
              className={
                i === breadcrumbs.length - 1
                  ? 'text-white font-medium'
                  : 'text-neutral-400'
              }
            >
              {b}
            </span>
            {i < breadcrumbs.length - 1 && <span className="text-neutral-700">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Middle Command Bar / Quick Search */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 transition-all text-xs w-72 lg:w-96 justify-between group shadow-inner"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
          <span>Kabel, Stecker, Lagerort suchen...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-neutral-400 shadow-xs">
          ⌘K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {onOpenCatalogModal && (
          <button
            onClick={onOpenCatalogModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Katalog</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleLightMode}
          title={isLightMode ? 'Zu Dunkelmodus wechseln' : 'Zu Hellmodus wechseln'}
          className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Add Cable Button (Electric Blue or White) */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-white font-medium text-xs shadow-md shadow-blue-500/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Kabel hinzufügen</span>
        </button>
      </div>
    </header>
  );
};

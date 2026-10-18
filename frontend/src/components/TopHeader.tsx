import React from 'react';
import { Search, Plus, Sun, Moon, Sparkles, ArrowLeft } from 'lucide-react';
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
    <header
      className={`h-16 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 transition-colors ${
        isLightMode
          ? 'bg-white/95 border-b border-neutral-200 text-neutral-900 shadow-xs'
          : 'bg-black/90 border-b border-neutral-800/80 text-white backdrop-blur-md'
      }`}
    >
      {/* Left Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {onNavigateLanding ? (
          <button
            onClick={onNavigateLanding}
            className={`transition-colors flex items-center gap-1 font-semibold ${
              isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </button>
        ) : (
          <span className={isLightMode ? 'text-neutral-400' : 'text-neutral-500'}>AGF Drawer</span>
        )}
        <span className={isLightMode ? 'text-neutral-300' : 'text-neutral-700'}>/</span>
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={b}>
            <span
              className={
                i === breadcrumbs.length - 1
                  ? isLightMode
                    ? 'text-neutral-900 font-semibold'
                    : 'text-white font-medium'
                  : isLightMode
                  ? 'text-neutral-500'
                  : 'text-neutral-400'
              }
            >
              {b}
            </span>
            {i < breadcrumbs.length - 1 && (
              <span className={isLightMode ? 'text-neutral-300' : 'text-neutral-700'}>/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Middle Command Bar / Quick Search */}
      <button
        onClick={onOpenCommandPalette}
        className={`hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border text-xs w-72 lg:w-96 justify-between group transition-all ${
          isLightMode
            ? 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
            : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 shadow-inner'
        }`}
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600" />
          <span>Kabel, Stecker, Lagerort suchen...</span>
        </div>
        <kbd
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
            isLightMode
              ? 'bg-neutral-200/70 border-neutral-300 text-neutral-700'
              : 'bg-neutral-800 border-neutral-700 text-neutral-400 shadow-xs'
          }`}
        >
          ⌘K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {onOpenCatalogModal && (
          <button
            onClick={onOpenCatalogModal}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isLightMode
                ? 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200/70 text-neutral-800'
                : 'border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Katalog</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleLightMode}
          title={isLightMode ? 'Zu Dunkelmodus wechseln' : 'Zu Hellmodus wechseln'}
          className={`p-2 rounded-lg border transition-colors ${
            isLightMode
              ? 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/60'
              : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          {isLightMode ? <Moon className="w-4 h-4 text-neutral-800" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Add Cable Button (Electric Blue) */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0057FF] hover:bg-blue-600 active:scale-98 text-white font-medium text-xs shadow-md shadow-blue-500/15 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Kabel hinzufügen</span>
        </button>
      </div>
    </header>
  );
};

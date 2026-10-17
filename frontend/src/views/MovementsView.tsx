import React, { useState } from 'react';
import {
  History,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';
import { MovementItem } from '../types';

interface MovementsViewProps {
  movements: MovementItem[];
  isLightMode?: boolean;
}

export const MovementsView: React.FC<MovementsViewProps> = ({ movements, isLightMode = false }) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = movements.filter((m) => {
    const matchesAction = filterAction === 'all' || m.action === filterAction;
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.item_name && m.item_name.toLowerCase().includes(search.toLowerCase())) ||
      (m.from && m.from.toLowerCase().includes(search.toLowerCase())) ||
      (m.to && m.to.toLowerCase().includes(search.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  // Group by date_group
  const grouped = filtered.reduce((acc, item) => {
    const g = item.date_group || 'Vergangene Tage';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {} as Record<string, MovementItem[]>);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'check_out':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isLightMode
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-blue-950/60 border-blue-900 text-blue-400'
          }`}>
            <ArrowUpRight className="w-3 h-3" /> Ausgebucht
          </span>
        );
      case 'return':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isLightMode
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-emerald-950/60 border-emerald-900 text-emerald-400'
          }`}>
            <ArrowDownLeft className="w-3 h-3" /> Eingelagert
          </span>
        );
      case 'create':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isLightMode
              ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
              : 'bg-neutral-900 border-neutral-700 text-neutral-300'
          }`}>
            <PlusCircle className="w-3 h-3" /> Neu erfasst
          </span>
        );
      case 'missing':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isLightMode
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-red-950/60 border-red-900 text-red-400'
          }`}>
            <AlertTriangle className="w-3 h-3" /> Vermisst
          </span>
        );
      default:
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            isLightMode ? 'bg-neutral-100 text-neutral-700' : 'bg-neutral-900 text-neutral-400'
          }`}>
            {action}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2.5 ${
            isLightMode ? 'text-neutral-900' : 'text-white'
          }`}>
            <History className="w-6 h-6 text-[#0057FF]" />
            Bewegungsverlauf & Audit
          </h1>
          <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Lückenloses Protokoll aller Ausbuchtungen, Einlagerungen und Statusänderungen.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3 top-3 ${isLightMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Aktivitäten filtern..."
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs md:text-sm focus:outline-none focus:border-[#0057FF] ${
              isLightMode
                ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 shadow-xs'
                : 'bg-neutral-900/90 border-neutral-800 text-white placeholder-neutral-500'
            }`}
          />
        </div>

        <div className={`flex items-center gap-1 border p-0.5 rounded-xl ${
          isLightMode ? 'bg-white border-neutral-200 shadow-xs' : 'bg-neutral-900 border-neutral-800'
        }`}>
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterAction === 'all'
                ? isLightMode
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'bg-neutral-800 text-white font-medium'
                : isLightMode
                ? 'text-neutral-600 hover:text-neutral-900'
                : 'text-neutral-400'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilterAction('check_out')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterAction === 'check_out'
                ? isLightMode
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'bg-neutral-800 text-white font-medium'
                : isLightMode
                ? 'text-neutral-600 hover:text-neutral-900'
                : 'text-neutral-400'
            }`}
          >
            Ausgebucht
          </button>
          <button
            onClick={() => setFilterAction('return')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterAction === 'return'
                ? isLightMode
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'bg-neutral-800 text-white font-medium'
                : isLightMode
                ? 'text-neutral-600 hover:text-neutral-900'
                : 'text-neutral-400'
            }`}
          >
            Eingelagert
          </button>
        </div>
      </div>

      {/* Timeline grouped list */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([dateLabel, items]) => (
          <div key={dateLabel} className="space-y-3">
            <div className={`text-xs font-semibold uppercase tracking-wider font-mono ${
              isLightMode ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              {dateLabel}
            </div>

            <div className={`rounded-2xl border divide-y overflow-hidden shadow-xs ${
              isLightMode ? 'bg-white border-neutral-200 divide-neutral-100' : 'bg-neutral-950 border-neutral-800/80 divide-neutral-900'
            }`}>
              {items.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isLightMode ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      isLightMode
                        ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                        : 'bg-gradient-to-tr from-neutral-800 to-neutral-700 border-neutral-600 text-white'
                    }`}>
                      {m.user_initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {m.title}
                        </span>
                        {getActionBadge(m.action)}
                      </div>
                      <div className={`text-xs mt-1 flex items-center gap-2 ${
                        isLightMode ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        {m.from && m.to ? (
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <span>{m.from}</span>
                            <ArrowRight className="w-3 h-3 text-neutral-400" />
                            <span className={isLightMode ? 'text-neutral-800' : 'text-neutral-300'}>{m.to}</span>
                          </div>
                        ) : (
                          <span>{m.item_name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs font-mono self-end sm:self-center ${
                    isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

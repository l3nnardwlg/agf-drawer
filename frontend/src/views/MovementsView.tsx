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
}

export const MovementsView: React.FC<MovementsViewProps> = ({ movements }) => {
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-900 text-blue-400 text-[10px] font-mono">
            <ArrowUpRight className="w-3 h-3" /> Ausgebucht
          </span>
        );
      case 'return':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-900 text-emerald-400 text-[10px] font-mono">
            <ArrowDownLeft className="w-3 h-3" /> Eingelagert
          </span>
        );
      case 'create':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] font-mono">
            <PlusCircle className="w-3 h-3" /> Neu erfasst
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/60 border border-red-900 text-red-400 text-[10px] font-mono">
            <AlertTriangle className="w-3 h-3" /> Vermisst
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 text-[10px] font-mono">
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
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#0057FF]" />
            Bewegungsverlauf & Audit
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Lückenloses Protokoll aller Ausbuchtungen, Einlagerungen und Statusänderungen.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Aktivitäten filtern..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0057FF]"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-0.5 rounded-xl">
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterAction === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilterAction('check_out')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterAction === 'check_out' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
            }`}
          >
            Ausgebucht
          </button>
          <button
            onClick={() => setFilterAction('return')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterAction === 'return' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
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
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              {dateLabel}
            </div>

            <div className="rounded-2xl bg-neutral-950 border border-neutral-800/80 divide-y divide-neutral-900 overflow-hidden shadow-sm">
              {items.map((m) => (
                <div
                  key={m.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                      {m.user_initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{m.title}</span>
                        {getActionBadge(m.action)}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                        {m.from && m.to ? (
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <span>{m.from}</span>
                            <ArrowRight className="w-3 h-3 text-neutral-500" />
                            <span className="text-neutral-300">{m.to}</span>
                          </div>
                        ) : (
                          <span>{m.item_name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-neutral-400 self-end sm:self-center">
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

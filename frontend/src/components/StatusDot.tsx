import React from 'react';
import { UnitStatus } from '../types';

interface StatusDotProps {
  status: UnitStatus | string;
  count?: number;
  label?: string;
  showCount?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  count,
  label,
  showCount = true,
  className = '',
}) => {
  let dotColor = 'bg-emerald-400';
  let defaultLabel = 'Verfügbar';

  switch (status) {
    case 'stored':
      dotColor = 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]';
      defaultLabel = 'Verfügbar';
      break;
    case 'in_use':
      dotColor = 'bg-[#0057FF] shadow-[0_0_8px_rgba(0,87,255,0.5)]';
      defaultLabel = 'In Verwendung';
      break;
    case 'loaned':
      dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
      defaultLabel = 'Verliehen';
      break;
    case 'missing':
      dotColor = 'bg-[#FF2020] shadow-[0_0_8px_rgba(255,32,32,0.6)]';
      defaultLabel = 'Vermisst';
      break;
    case 'retired':
      dotColor = 'bg-neutral-500';
      defaultLabel = 'Ausgemustert';
      break;
    default:
      dotColor = 'bg-neutral-400';
      defaultLabel = String(status);
  }

  const displayText = label || defaultLabel;

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <span>{displayText}</span>
      {showCount && typeof count === 'number' && (
        <span className="font-mono text-neutral-400">({count})</span>
      )}
    </div>
  );
};

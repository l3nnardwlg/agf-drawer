import React from 'react';

interface CableSchematicProps {
  connectorA: string;
  connectorB: string;
  color?: string;
  lengthCm?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CableSchematic: React.FC<CableSchematicProps> = ({
  connectorA,
  connectorB,
  color = 'Schwarz',
  lengthCm,
  size = 'md',
  className = '',
}) => {
  // Normalize color for SVG stroke
  const getStrokeColor = (colName?: string) => {
    const lower = (colName || '').toLowerCase();
    if (lower.includes('weiß') || lower.includes('white')) return '#E5E5E5';
    if (lower.includes('rot') || lower.includes('red')) return '#FF2020';
    if (lower.includes('blau') || lower.includes('blue')) return '#0057FF';
    if (lower.includes('grau') || lower.includes('grey') || lower.includes('gray')) return '#737373';
    return '#A3A3A3'; // default cable wire tone
  };

  const stroke = getStrokeColor(color);

  if (size === 'sm') {
    return (
      <div className={`flex items-center justify-between gap-2 px-3 py-2 bg-neutral-900/60 rounded-lg border border-neutral-800 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 bg-neutral-800 border border-neutral-700 rounded-xs flex items-center justify-center">
            <div className="w-2 h-1.5 bg-neutral-600 rounded-2xs" />
          </div>
          <span className="text-xs font-medium text-white truncate max-w-[90px]">{connectorA}</span>
        </div>

        <svg className="flex-1 h-4 max-w-[80px]" viewBox="0 0 80 16" fill="none">
          <path
            d="M 4 8 C 24 2, 56 14, 76 8"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white truncate max-w-[90px] text-right">{connectorB}</span>
          <div className="w-5 h-3 bg-neutral-800 border border-neutral-700 rounded-xs flex items-center justify-center">
            <div className="w-2 h-1.5 bg-neutral-600 rounded-2xs" />
          </div>
        </div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`w-full bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-xl flex items-center justify-between relative z-10 gap-4">
          {/* Connector A */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-10 bg-neutral-800/90 border border-neutral-600 rounded-lg shadow-inner flex items-center justify-center relative">
              <div className="w-8 h-4 bg-neutral-950 border border-neutral-700 rounded-xs flex items-center justify-center">
                <div className="w-4 h-1.5 bg-amber-400/80 rounded-2xs" />
              </div>
              <div className="absolute -right-2 top-3 bottom-3 w-2 bg-neutral-700 rounded-r-xs" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white uppercase">{connectorA}</span>
            <span className="text-[11px] text-neutral-400">Stecker A</span>
          </div>

          {/* Symmetrical Wave Cable */}
          <div className="flex-1 relative flex flex-col items-center">
            <svg className="w-full h-16" viewBox="0 0 240 64" fill="none" preserveAspectRatio="none">
              <path
                d="M 10 32 C 70 8, 110 56, 170 32 C 190 24, 210 28, 230 32"
                stroke={stroke}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            {lengthCm && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800/90 border border-neutral-700 text-neutral-300 font-mono -mt-2">
                {(lengthCm / 100).toFixed(1)} m
              </span>
            )}
          </div>

          {/* Connector B */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-10 bg-neutral-800/90 border border-neutral-600 rounded-lg shadow-inner flex items-center justify-center relative">
              <div className="absolute -left-2 top-3 bottom-3 w-2 bg-neutral-700 rounded-l-xs" />
              <div className="w-8 h-4 bg-neutral-950 border border-neutral-700 rounded-xs flex items-center justify-center">
                <div className="w-4 h-1.5 bg-amber-400/80 rounded-2xs" />
              </div>
            </div>
            <span className="text-sm font-semibold tracking-wide text-white uppercase">{connectorB}</span>
            <span className="text-[11px] text-neutral-400">Stecker B</span>
          </div>
        </div>
      </div>
    );
  }

  // Default 'md' size for Cards
  return (
    <div className={`w-full py-3 px-4 bg-neutral-950/40 rounded-xl border border-neutral-800/60 flex items-center justify-between gap-3 ${className}`}>
      {/* Connector A tag */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-5 bg-neutral-800 border border-neutral-700 rounded-xs flex items-center justify-center">
          <div className="w-3.5 h-2 bg-neutral-900 border border-neutral-600 rounded-2xs" />
        </div>
        <span className="text-xs font-semibold text-neutral-200">{connectorA}</span>
      </div>

      {/* S-curve wire */}
      <div className="flex-1 min-w-[60px]">
        <svg className="w-full h-8" viewBox="0 0 120 32" fill="none" preserveAspectRatio="none">
          <path
            d="M 5 16 C 35 4, 85 28, 115 16"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Connector B tag */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-neutral-200">{connectorB}</span>
        <div className="w-7 h-5 bg-neutral-800 border border-neutral-700 rounded-xs flex items-center justify-center">
          <div className="w-3.5 h-2 bg-neutral-900 border border-neutral-600 rounded-2xs" />
        </div>
      </div>
    </div>
  );
};

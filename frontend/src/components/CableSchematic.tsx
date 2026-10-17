import React from 'react';

interface CableSchematicProps {
  connectorA: string;
  connectorB: string;
  color?: string;
  lengthCm?: number | null;
  size?: 'sm' | 'md' | 'lg';
  isLightMode?: boolean;
  className?: string;
}

export const CableSchematic: React.FC<CableSchematicProps> = ({
  connectorA,
  connectorB,
  color = 'Schwarz',
  lengthCm,
  size = 'md',
  isLightMode = false,
  className = '',
}) => {
  // Normalize color for SVG stroke
  const getStrokeColor = (colName?: string) => {
    const lower = (colName || '').toLowerCase();
    if (lower.includes('weiß') || lower.includes('white')) {
      return isLightMode ? '#9CA3AF' : '#E5E5E5';
    }
    if (lower.includes('rot') || lower.includes('red')) return '#FF2020';
    if (lower.includes('blau') || lower.includes('blue')) return '#0057FF';
    if (lower.includes('grau') || lower.includes('grey') || lower.includes('gray')) {
      return isLightMode ? '#6B7280' : '#737373';
    }
    return isLightMode ? '#374151' : '#A3A3A3'; // default cable wire tone
  };

  const stroke = getStrokeColor(color);

  if (size === 'sm') {
    return (
      <div
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${
          isLightMode
            ? 'bg-neutral-100/70 border-neutral-200 text-neutral-900'
            : 'bg-neutral-900/60 border-neutral-800 text-white'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-3 rounded-xs border flex items-center justify-center ${
              isLightMode ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-800 border-neutral-700'
            }`}
          >
            <div className={`w-2 h-1.5 rounded-2xs ${isLightMode ? 'bg-neutral-400' : 'bg-neutral-600'}`} />
          </div>
          <span className={`text-xs font-medium truncate max-w-[90px] ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
            {connectorA}
          </span>
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
          <span className={`text-xs font-medium truncate max-w-[90px] text-right ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
            {connectorB}
          </span>
          <div
            className={`w-5 h-3 rounded-xs border flex items-center justify-center ${
              isLightMode ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-800 border-neutral-700'
            }`}
          >
            <div className={`w-2 h-1.5 rounded-2xs ${isLightMode ? 'bg-neutral-400' : 'bg-neutral-600'}`} />
          </div>
        </div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`w-full rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden border transition-colors ${
          isLightMode
            ? 'bg-white border-neutral-200 shadow-xs'
            : 'bg-neutral-900/80 border-neutral-800/80 shadow-inner'
        } ${className}`}
      >
        {/* Subtle grid background */}
        <div
          className={`absolute inset-0 [background-size:16px_16px] pointer-events-none ${
            isLightMode
              ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-60'
              : 'bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] opacity-40'
          }`}
        />

        <div className="w-full max-w-xl flex items-center justify-between relative z-10 gap-4">
          {/* Connector A */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-10 rounded-lg shadow-inner flex items-center justify-center relative border ${
                isLightMode ? 'bg-neutral-100 border-neutral-300' : 'bg-neutral-800/90 border-neutral-600'
              }`}
            >
              <div
                className={`w-8 h-4 rounded-xs border flex items-center justify-center ${
                  isLightMode ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-950 border-neutral-700'
                }`}
              >
                <div className="w-4 h-1.5 bg-amber-400/80 rounded-2xs" />
              </div>
              <div
                className={`absolute -right-2 top-3 bottom-3 w-2 rounded-r-xs ${
                  isLightMode ? 'bg-neutral-300' : 'bg-neutral-700'
                }`}
              />
            </div>
            <span className={`text-sm font-semibold tracking-wide uppercase ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
              {connectorA}
            </span>
            <span className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Stecker A
            </span>
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
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono -mt-2 border ${
                  isLightMode
                    ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
                    : 'bg-neutral-800/90 border-neutral-700 text-neutral-300'
                }`}
              >
                {(lengthCm / 100).toFixed(1)} m
              </span>
            )}
          </div>

          {/* Connector B */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-10 rounded-lg shadow-inner flex items-center justify-center relative border ${
                isLightMode ? 'bg-neutral-100 border-neutral-300' : 'bg-neutral-800/90 border-neutral-600'
              }`}
            >
              <div
                className={`absolute -left-2 top-3 bottom-3 w-2 rounded-l-xs ${
                  isLightMode ? 'bg-neutral-300' : 'bg-neutral-700'
                }`}
              />
              <div
                className={`w-8 h-4 rounded-xs border flex items-center justify-center ${
                  isLightMode ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-950 border-neutral-700'
                }`}
              >
                <div className="w-4 h-1.5 bg-amber-400/80 rounded-2xs" />
              </div>
            </div>
            <span className={`text-sm font-semibold tracking-wide uppercase ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
              {connectorB}
            </span>
            <span className={`text-[11px] ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Stecker B
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default 'md' size for Cards
  return (
    <div
      className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
        isLightMode
          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
          : 'bg-neutral-950/40 border-neutral-800/60 text-neutral-200'
      } ${className}`}
    >
      {/* Connector A tag */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`w-7 h-5 rounded-xs border flex items-center justify-center ${
            isLightMode ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-800 border-neutral-700'
          }`}
        >
          <div
            className={`w-3.5 h-2 rounded-2xs border ${
              isLightMode ? 'bg-neutral-300 border-neutral-400' : 'bg-neutral-900 border-neutral-600'
            }`}
          />
        </div>
        <span className={`text-xs font-semibold ${isLightMode ? 'text-neutral-800' : 'text-neutral-200'}`}>
          {connectorA}
        </span>
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
        <span className={`text-xs font-semibold ${isLightMode ? 'text-neutral-800' : 'text-neutral-200'}`}>
          {connectorB}
        </span>
        <div
          className={`w-7 h-5 rounded-xs border flex items-center justify-center ${
            isLightMode ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-800 border-neutral-700'
          }`}
        >
          <div
            className={`w-3.5 h-2 rounded-2xs border ${
              isLightMode ? 'bg-neutral-300 border-neutral-400' : 'bg-neutral-900 border-neutral-600'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useAQI } from '@/hooks/useDataHooks';
import { validatePollutant } from '@/utils/apiValidator';
import { pollutantData } from '@/utils/pollutantSources';

export default function PollutantBars() {
  const { data: aqiData } = useAQI();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  if (!aqiData) return null;

  const rawValues = Object.entries(pollutantData).map(([key, info]) => {
    const rawVal = aqiData.iaqi?.[key]?.v;
    return { key, info, value: validatePollutant(rawVal) };
  });

  const totalValue = rawValues.reduce((sum, p) => sum + (p.value || 0), 0);

  const pollutants = rawValues.map(({ key, info, value }) => {
    const pct = value !== null ? Math.min((value / (info.safeLimit * 3)) * 100, 100) : 0;
    const contributionPct = totalValue > 0 && value !== null ? Math.round((value / totalValue) * 100) : 0;
    const color = value !== null
      ? value <= info.safeLimit ? '#4CAF50' : value <= info.safeLimit * 2 ? '#FF9800' : '#F44336'
      : '#757c7e';
    return { key, info, value, pct, contributionPct, color };
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold font-headline text-on-surface px-1">🔬 Pollutant Breakdown</h2>
      <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 space-y-5 shadow-sm border border-outline-variant/10">
        {pollutants.map(({ key, info, value, pct, contributionPct, color }, i) => (
          <div
            key={key}
            className="transition-all duration-300"
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-semibold font-headline text-on-surface flex items-center gap-2">
                {info.name}
                {value !== null && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
                    {contributionPct}% Impact
                  </span>
                )}
              </span>
              <span className="text-xs text-on-surface-variant font-body">
                {value !== null ? `${value} ${info.unit}` : <em className="text-outline">Sensor offline</em>}
              </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-surface-container-high">
              {value !== null && (
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)`, width: `${pct}%` }}
                />
              )}
              {/* Safe limit marker */}
              <div
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${Math.min((info.safeLimit / (info.safeLimit * 3)) * 100, 100)}%`,
                  background: 'rgba(45,52,53,0.25)',
                  borderRight: '1px dashed rgba(45,52,53,0.15)',
                }}
              />
            </div>
            {hoveredKey === key && (
              <p className="text-[10px] text-on-surface-variant mt-1.5 font-body animate-in fade-in">
                Source: {info.source} | Safe limit: {info.safeLimit} {info.unit}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

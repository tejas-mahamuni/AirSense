import { useState } from 'react';
import { useAQI } from '@/hooks/useDataHooks';
import { validateAQI } from '@/utils/apiValidator';

export default function ActionImpactCalculator() {
  const { data: aqiData } = useAQI();
  const baseAqi = validateAQI(aqiData?.aqi) ?? 50;

  const actions = [
    { id: 'transport', label: 'Use public transport', reduction: 12 },
    { id: 'carpool', label: 'Carpool to work', reduction: 8 },
    { id: 'trees', label: 'Plant trees locally', reduction: 3 },
    { id: 'energy', label: 'Reduce energy consumption', reduction: 5 },
    { id: 'waste', label: 'Compost organic waste', reduction: 2 },
  ];

  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  const toggleAction = (id: string) => {
    const next = new Set(selectedActions);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedActions(next);
  };

  const totalReduction = actions
    .filter(a => selectedActions.has(a.id))
    .reduce((sum, a) => sum + a.reduction, 0);

  const newAqi = Math.max(0, Math.round(baseAqi - (baseAqi * (totalReduction / 100))));

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h2 className="text-lg font-bold font-headline text-on-surface mb-4">🌱 Action Impact Calculator</h2>
      <p className="text-xs text-on-surface-variant font-body mb-6">
        Select actions to see how community effort reduces your local AQI.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {actions.map(a => (
            <label key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedActions.has(a.id)}
                onChange={() => toggleAction(a.id)}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20"
              />
              <span className="text-sm font-semibold text-on-surface">{a.label}</span>
              <span className="ml-auto text-xs font-bold text-primary">-{a.reduction}%</span>
            </label>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="text-center mb-4 relative z-10">
            <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest font-label">Current AQI</p>
            <p className="text-3xl font-extrabold text-on-surface font-headline opacity-50 line-through decoration-red-500/50">{baseAqi}</p>
          </div>
          <div className="text-center relative z-10">
            <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest font-label">Potential AQI</p>
            <p className="text-6xl font-black text-primary font-headline tracking-tighter">{newAqi}</p>
          </div>
          <p className="mt-6 text-[10px] text-center text-on-surface-variant bg-surface-container/50 border border-outline-variant/10 py-1.5 px-3 rounded-full relative z-10">
            Based on 30% city-wide adoption
          </p>
        </div>
      </div>
    </div>
  );
}

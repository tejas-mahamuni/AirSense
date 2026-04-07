import { useState } from 'react';
import { useAQI } from '@/hooks/useDataHooks';
import { validateAQI } from '@/utils/apiValidator';
import { DoorOpen, DoorClosed, Fan } from 'lucide-react';

export default function IndoorEstimator() {
  const { data: aqiData } = useAQI();
  const [windows, setWindows] = useState<'open' | 'closed'>('closed');
  const [purifier, setPurifier] = useState(false);

  if (!aqiData) return null;
  const aqi = validateAQI(aqiData.aqi) ?? 0;

  let factor = windows === 'open' ? 0.8 : 0.3;
  if (purifier) factor = 0.15;
  const indoor = Math.round(aqi * factor);
  const savings = aqi - indoor;

  const indoorColor = indoor <= 50 ? '#4CAF50' : indoor <= 100 ? '#FF9800' : '#F44336';

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h3 className="text-sm font-semibold font-headline text-on-surface mb-4">🏠 Indoor AQI Estimate</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setWindows('open')}
          className={`flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1.5 rounded-full font-label font-semibold border transition-all ${
            windows === 'open'
              ? 'bg-primary-container text-on-primary-container border-primary/20'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:bg-surface-container'
          }`}
        >
          <DoorOpen size={14} /> Open
        </button>
        <button
          onClick={() => setWindows('closed')}
          className={`flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1.5 rounded-full font-label font-semibold border transition-all ${
            windows === 'closed'
              ? 'bg-primary-container text-on-primary-container border-primary/20'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:bg-surface-container'
          }`}
        >
          <DoorClosed size={14} /> Closed
        </button>
        <button
          onClick={() => setPurifier(!purifier)}
          className={`flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1.5 rounded-full font-label font-semibold border transition-all ${
            purifier
              ? 'bg-primary-container text-on-primary-container border-primary/20'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:bg-surface-container'
          }`}
        >
          <Fan size={14} /> Purifier
        </button>
      </div>

      <div className="text-center py-3">
        <p className="text-4xl font-bold font-headline" style={{ color: indoorColor }}>{indoor}</p>
        <p className="text-xs text-on-surface-variant mt-1 font-body">Estimated Indoor AQI</p>
      </div>

      <p className="text-xs text-outline text-center font-body">
        {windows === 'open'
          ? `Closing windows could reduce indoor AQI by ~${Math.round(aqi * 0.5)} points.`
          : purifier
          ? `Purifier reducing exposure by ~${savings} points.`
          : `Consider an air purifier for an additional ~${Math.round(aqi * 0.15)} point reduction.`}
      </p>
    </div>
  );
}

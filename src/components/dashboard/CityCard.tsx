import React from 'react';

interface Metric {
  label: string;
  value: number;
}

interface CityCardProps {
  city: string;
  country: string;
  flagUrl: string;
  aqiStatus: string;
  aqiValue: number;
  aqiColorHex: string; // e.g., #22c55e (green)
  aqiColorClass: string; // Tailwind class e.g., 'text-green-700'
  aqiBgClass: string; // Tailwind class e.g., 'bg-green-50'
  aqiDotClass: string; // Tailwind class e.g., 'bg-green-500'
  aqiStrokeClass: string; // Tailwind stroke class
  metrics: Metric[];
}

const CityCard = ({ 
  city, 
  country, 
  flagUrl, 
  aqiStatus, 
  aqiValue, 
  aqiColorHex,
  aqiColorClass,
  aqiBgClass,
  aqiDotClass,
  aqiStrokeClass,
  metrics 
}: CityCardProps) => {
  // Simple sparkline path generation mock
  const sparklineStrokeClass = aqiStrokeClass ? aqiStrokeClass : 'text-primary stroke-current';

  return (
    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm border border-outline-variant/10 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg font-bold font-headline text-on-surface">{city}</span>
            <img alt={country} className="w-4 h-3 object-cover rounded-sm shadow-sm" src={flagUrl} />
          </div>
          <p className="text-xs text-on-surface-variant font-medium font-body">{country}</p>
          <div className={`mt-2 inline-flex items-center gap-1 ${aqiBgClass} ${aqiColorClass} px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide font-label`}>
            <span className={`w-1.5 h-1.5 ${aqiDotClass} rounded-full`}></span>
            {aqiStatus}
          </div>
        </div>
        
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-100 stroke-current text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
            <path className={`${aqiStrokeClass} stroke-current`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray={`${Math.min(aqiValue, 100)}, 100`} strokeLinecap="round" strokeWidth="3"></path>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-black leading-none font-headline ${aqiColorClass.replace('700', '600')}`}>{aqiValue}</span>
            <span className="text-[8px] font-bold text-outline-variant uppercase font-label">AQI</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-container-low p-2 rounded-xl text-center border border-outline-variant/5">
            <p className="text-[8px] uppercase font-bold text-outline-variant mb-0.5 font-label">{m.label}</p>
            <p className="text-[11px] font-bold font-headline text-on-surface">{m.value}</p>
            <p className="text-[7px] text-outline-variant font-body">µg/m³</p>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-2 font-label">Air Quality Forecast</p>
        <div className="h-10 w-full relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path className="sparkline" d="M0 30 Q 10 25, 20 28 T 40 22 T 60 32 T 80 20 T 100 25" fill="none" style={{stroke: aqiColorHex}}></path>
            <circle cx="100" cy="25" r="3" fill={aqiColorHex}></circle>
          </svg>
        </div>
        <div className="flex justify-between mt-1 text-[8px] font-bold text-outline-variant font-body">
          <span>04:00</span><span>06:00</span><span>08:00</span><span>10:00</span>
        </div>
      </div>
    </div>
  );
};

export default CityCard;

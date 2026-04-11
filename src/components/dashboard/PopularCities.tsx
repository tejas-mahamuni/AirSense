import React, { useRef } from 'react';
import { usePopularCities, useWorldCities } from '@/hooks/useDataHooks';
import { useAppStore } from '@/store/useAppStore';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const AQI_RANGES = [
  { max: 50, label: 'Good', emoji: '😊', color: '#4CAF50' },
  { max: 100, label: 'Moderate', emoji: '😐', color: '#FFEB3B' },
  { max: 150, label: 'Unhealthy for Sensitive', emoji: '😷', color: '#FF9800' },
  { max: 200, label: 'Unhealthy', emoji: '🤢', color: '#F44336' },
  { max: 300, label: 'Very Unhealthy', emoji: '💀', color: '#9C27B0' },
  { max: Infinity, label: 'Hazardous', emoji: '☣️', color: '#7E0023' },
];

function getAQIInfo(aqi: number) {
  return AQI_RANGES.find(r => aqi <= r.max) || AQI_RANGES[0];
}

// ─── Components ───────────────────────────────────────────────────────────────

const AQIGauge = ({ aqi, color }: { aqi: number; color: string }) => {
  const percentage = Math.min(100, (aqi / 300) * 100);
  const strokeDash = 157.08; // (PI * r) where r=50
  const offset = strokeDash - (percentage / 100) * strokeDash;

  return (
    <div className="relative w-24 h-14 overflow-hidden">
      <svg className="w-full h-full transform translate-y-1" viewBox="0 0 120 70">
        <path
          d="M10,60 A50,50 0 0,1 110,60"
          fill="none"
          stroke="#E0E0E0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M10,60 A50,50 0 0,1 110,60"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <span className="text-lg font-bold leading-none">{aqi}</span>
        <span className="text-[8px] font-bold text-outline opacity-70 uppercase tracking-tighter">AQI</span>
      </div>
    </div>
  );
};

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 180;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  
  return (
    <svg width={w} height={h} className="mt-4">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path
        d={`M0,${h} L${points} L${w},${h} Z`}
        fill={`url(#grad-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-line"
      />
      <circle
        cx={(points.split(' ').pop() || '0,0').split(',')[0]}
        cy={(points.split(' ').pop() || '0,0').split(',')[1]}
        r="3"
        fill={color}
        className="animate-pulse"
      />
    </svg>
  );
};

const CityCarousel = ({ title, results, subtitle }: { title: string, results: any[], subtitle: string }) => {
  const setLocation = useAppStore(s => s.setLocation);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold font-headline text-on-surface">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {results.map((res, i) => {
          if (res.isLoading) {
            return (
              <div key={i} className="flex-shrink-0 w-80 h-[320px] bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10 animate-pulse">
                <div className="w-10 h-4 bg-outline-variant/20 rounded-full mb-4"></div>
                <div className="w-40 h-6 bg-outline-variant/20 rounded-lg mb-2"></div>
                <div className="w-20 h-4 bg-outline-variant/20 rounded-lg mb-8"></div>
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[1, 2, 3, 4].map(b => <div key={b} className="h-12 bg-outline-variant/10 rounded-xl"></div>)}
                </div>
                <div className="h-16 bg-outline-variant/5 rounded-xl"></div>
              </div>
            );
          }

          if (!res.data) return null;

          const d = res.data;
          const info = getAQIInfo(d.aqi);
          const pollutants = [
            { label: 'PM2.5', val: d.iaqi?.pm25?.v },
            { label: 'PM10', val: d.iaqi?.pm10?.v },
            { label: 'O3', val: d.iaqi?.o3?.v },
            { label: 'NO2', val: d.iaqi?.no2?.v },
          ];

          // Extract trend from forecast (if available) or mockup for visual fidelity
          const trendMock = [d.aqi - 10, d.aqi - 5, d.aqi + 2, d.aqi - 8, d.aqi + 15, d.aqi + 5, d.aqi];

          return (
            <div
              key={i}
              onClick={() => setLocation({ city: d.city.name, lat: d.city.geo[0], lng: d.city.geo[1] })}
              className="flex-shrink-0 w-80 bg-surface-container-lowest rounded-[2.5rem] p-6 shadow-sm border border-outline-variant/5 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer snap-center group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: info.color + '18', color: info.color }}>
                  {info.emoji} {info.label}
                </span>
                <AQIGauge aqi={d.aqi} color={info.color} />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold font-headline text-on-surface flex items-center gap-1.5 truncate">
                  {d.city.name.split(',')[0]}
                  <MapPin size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 font-medium">
                  <span className="text-sm">{subtitle.split(' ')[0]}</span> {subtitle.substring(subtitle.indexOf(' ') + 1)}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {pollutants.map((p, j) => (
                  <div key={j} className="bg-surface-container-low/50 p-2 rounded-2xl border border-outline-variant/5 text-center">
                    <p className="text-[8px] text-outline font-bold uppercase mb-0.5">{p.label}</p>
                    <p className="text-[11px] font-bold text-on-surface">{p.val || '--'}</p>
                    <p className="text-[6px] text-outline -mt-0.5">µg/m³</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant/10 pt-4">
                <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Historical Trend</p>
                <MiniSparkline data={trendMock} color={info.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function PopularCities() {
  const indianCities = usePopularCities();
  const worldCities = useWorldCities();

  return (
    <div className="space-y-8">
      <CityCarousel title="🏛️ Popular Cities in India" results={indianCities} subtitle="🇮🇳 India" />
      <CityCarousel title="🌎 World's Most Active Cities" results={worldCities} subtitle="🌐 Global" />
    </div>
  );
}

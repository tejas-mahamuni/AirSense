import React from 'react';
import { useWeather, useForecast } from '@/hooks/useDataHooks';
import { Wind, Thermometer, Droplets, Eye, Gauge, CloudDrizzle } from 'lucide-react';

interface CardData {
  icon: React.ReactNode;
  label: string;
  value: string;
  impact: { emoji: string; label: string; color: string };
  sparkline: number[];
}

function getImpact(type: string, val: number) {
  switch (type) {
    case 'wind': return val < 5 ? { emoji: '🔴', label: 'Stagnant', color: '#F44336' } : val <= 15 ? { emoji: '🟡', label: 'Moderate', color: '#FF9800' } : { emoji: '🟢', label: 'Dispersing', color: '#4CAF50' };
    case 'temp': return (val < 10 || val > 35) ? { emoji: '🔴', label: 'Extreme', color: '#F44336' } : val >= 20 && val <= 30 ? { emoji: '🟢', label: 'Comfortable', color: '#4CAF50' } : { emoji: '🟡', label: 'Moderate', color: '#FF9800' };
    case 'humidity': return val > 70 ? { emoji: '🔴', label: 'High Moisture', color: '#F44336' } : val >= 50 ? { emoji: '🟡', label: 'Moderate', color: '#FF9800' } : { emoji: '🟢', label: 'Dry Air', color: '#4CAF50' };
    case 'visibility': return val < 5 ? { emoji: '🔴', label: 'Poor', color: '#F44336' } : val <= 10 ? { emoji: '🟡', label: 'Fair', color: '#FF9800' } : { emoji: '🟢', label: 'Clear', color: '#4CAF50' };
    case 'pressure': return val < 1005 ? { emoji: '🔴', label: 'Low', color: '#F44336' } : val <= 1010 ? { emoji: '🟡', label: 'Normal', color: '#FF9800' } : { emoji: '🟢', label: 'High', color: '#4CAF50' };
    case 'dew': return val > 16 ? { emoji: '🔴', label: 'Muggy', color: '#F44336' } : val >= 10 ? { emoji: '🟡', label: 'Comfortable', color: '#FF9800' } : { emoji: '🟢', label: 'Dry', color: '#4CAF50' };
    default: return { emoji: '🟢', label: 'OK', color: '#4CAF50' };
  }
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-50">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WeatherGrid() {
  const { data: weather, isLoading } = useWeather();
  const { data: forecast } = useForecast();

  if (isLoading || !weather) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-headline text-on-surface px-1">🌡️ Weather Conditions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-[1.5rem] p-4 shadow-sm border border-outline-variant/10 animate-pulse h-32 flex flex-col justify-center items-center gap-2">
              <div className="w-10 h-10 bg-outline-variant/10 rounded-full"></div>
              <div className="w-16 h-3 bg-outline-variant/10 rounded"></div>
              <div className="w-20 h-5 bg-outline-variant/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const forecastSlice = (forecast || []).slice(0, 6);
  const tempSpark = forecastSlice.map(f => f.temp);
  const humiditySpark = forecastSlice.map(f => f.humidity);
  const windSpark = forecastSlice.map(f => f.wind_speed);
  const pressureSpark = forecastSlice.map(f => f.pressure);

  const cards: CardData[] = [
    { icon: <Wind size={18} />, label: 'Wind Speed', value: `${weather.wind_speed.toFixed(1)} km/h`, impact: getImpact('wind', weather.wind_speed), sparkline: windSpark },
    { icon: <Thermometer size={18} />, label: 'Temperature', value: `${Math.round(weather.temp)}°C`, impact: getImpact('temp', weather.temp), sparkline: tempSpark },
    { icon: <Droplets size={18} />, label: 'Humidity', value: `${weather.humidity}%`, impact: getImpact('humidity', weather.humidity), sparkline: humiditySpark },
    { icon: <Eye size={18} />, label: 'Visibility', value: `${weather.visibility} km`, impact: getImpact('visibility', weather.visibility), sparkline: [] },
    { icon: <Gauge size={18} />, label: 'Pressure', value: `${weather.pressure} hPa`, impact: getImpact('pressure', weather.pressure), sparkline: pressureSpark },
    { icon: <CloudDrizzle size={18} />, label: 'Dew Point', value: `${weather.dew_point}°C`, impact: getImpact('dew', weather.dew_point || 0), sparkline: [] },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold font-headline text-on-surface px-1">🌡️ Weather Conditions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest rounded-[1.5rem] p-4 shadow-sm border border-outline-variant/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-on-surface-variant">{card.icon}</div>
              <MiniSparkline data={card.sparkline} color={card.impact.color} />
            </div>
            <p className="text-xs text-on-surface-variant mb-1 font-label">{card.label}</p>
            <p className="text-xl font-bold font-headline text-on-surface mb-2">{card.value}</p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full font-label"
              style={{ background: card.impact.color + '18', color: card.impact.color }}
            >
              {card.impact.emoji} {card.impact.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

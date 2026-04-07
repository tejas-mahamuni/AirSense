import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useForecast, useAQI } from '@/hooks/useDataHooks';
import { getWeatherEmoji } from '@/utils/weatherIcons';

export default function HourlyCarousel() {
  const { data: forecast } = useForecast();
  const { data: aqiData } = useAQI();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!forecast || forecast.length === 0) return null;

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  const now = Math.floor(Date.now() / 1000);

  // Feature 2: Hyperlocal Pollution Prediction
  let predictionText = "AQI expected to remain stable in the short term.";
  if (forecast.length > 2) {
    const nextHours = forecast.slice(0, 3);
    const avgWindNext = nextHours.reduce((acc, curr) => acc + curr.wind_speed, 0) / nextHours.length;
    const currentWind = forecast[0]?.wind_speed || 0;
    const avgTemp = nextHours.reduce((acc, curr) => acc + curr.temp, 0) / nextHours.length;

    if (nextHours[0]?.pop > 30 || nextHours[1]?.pop > 30) {
      predictionText = "Rain expected soon to wash out pollutants, significantly improving AQI.";
    } else if (avgWindNext < Math.max(0, currentWind - 3)) {
      predictionText = "AQI expected to rise later as winds drop and pollutants stagnate.";
    } else if (avgWindNext > currentWind + 5) {
      predictionText = "Air quality expected to improve as stronger winds disperse particles.";
    } else if (avgTemp < 20 && new Date().getHours() > 17) {
      predictionText = "AQI expected to worsen overnight due to cool air inversion trapping emissions.";
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold font-headline text-on-surface px-1">🕐 Hourly Forecast</h2>
        {aqiData && (
          <p className="text-xs text-on-surface-variant font-body px-1 mt-1 flex items-center gap-1">
            <span className="text-[14px]">✨</span>
            <span className="font-semibold text-primary">AI Prediction:</span> {predictionText}
          </p>
        )}
      </div>
      <div className="relative">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface-container-lowest shadow-md border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container transition-colors hidden sm:flex">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface-container-lowest shadow-md border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container transition-colors hidden sm:flex">
          <ChevronRight size={16} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-1 py-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {forecast.slice(0, 16).map((item, i) => {
            const isCurrent = Math.abs(item.dt - now) < 5400;
            const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            return (
              <div
                key={item.dt}
                className={`flex-shrink-0 snap-center flex flex-col items-center gap-1.5 p-3 rounded-2xl min-w-[70px] border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-primary-container border-primary/20 shadow-md scale-105'
                    : 'bg-surface-container-lowest border-outline-variant/10 hover:bg-surface-container-low'
                }`}
              >
                <span className={`text-[10px] font-label ${isCurrent ? 'text-on-primary-container font-bold' : 'text-outline'}`}>
                  {isCurrent ? 'Now' : time}
                </span>
                <span className="text-xl">{getWeatherEmoji(item.icon)}</span>
                <span className={`text-sm font-semibold font-headline ${isCurrent ? 'text-on-primary-container' : 'text-on-surface'}`}>
                  {Math.round(item.temp)}°
                </span>
                {item.pop > 0 && (
                  <span className="text-[9px] text-outline font-label">💧{item.pop}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

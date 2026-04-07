import React from 'react';
import { useAQI, useForecast, useWeather } from '@/hooks/useDataHooks';
import { Wind, Gauge, TrendingUp, HelpCircle } from 'lucide-react';

export default function EnvironmentalCorrelation() {
  const { data: aqiData } = useAQI();
  const { data: weatherData } = useWeather();
  const { data: forecast } = useForecast();

  if (!aqiData || !weatherData || !forecast) return null;

  // Correlation Logic: Wind vs AQI
  // Generally: Low Wind (< 5 km/h) = High AQI (Stagnation)
  // Higher Wind (> 15 km/h) = Lower AQI (Dispersion)
  
  const wind = weatherData.wind_speed;
  const aqi = aqiData.aqi;
  
  const isStagnant = wind < 5;
  const isDispersion = wind > 15;
  
  const correlationScore = Math.max(0, Math.min(100, 100 - (aqi * 0.2) + (wind * 2)));

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10 group overflow-hidden relative">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold font-headline text-on-surface">📉 Pollution Correlation</h2>
            <div className="group/tips relative">
               <HelpCircle size={14} className="text-outline cursor-help" />
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-on-surface text-surface text-[10px] rounded-xl opacity-0 group-hover/tips:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                 Shows how wind speed is currently affecting air particle dispersion in your area.
               </div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant font-medium">Analyzing the relationship between wind and particles.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-surface-container-low px-6 py-3 rounded-2xl border border-outline-variant/5">
           <div className="text-center">
              <p className="text-[9px] font-bold text-outline uppercase mb-0.5">Dispersion</p>
              <p className={`text-lg font-black font-headline ${correlationScore > 70 ? 'text-emerald-500' : correlationScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                {Math.round(correlationScore)}%
              </p>
           </div>
           <div className="w-px h-8 bg-outline-variant/20"></div>
           <div className="text-center">
              <p className="text-[9px] font-bold text-outline uppercase mb-0.5">Wind Effect</p>
              <p className="text-sm font-bold text-on-surface">{isStagnant ? 'Stagnant' : isDispersion ? 'Clearing' : 'Neutral'}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Visual Comparison Gauge */}
        <div className="space-y-6">
           <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">wind_power</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Wind Influence</span>
                 </div>
                 <span className="text-xs font-bold text-on-surface">{wind} km/h</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-primary transition-all duration-1000 ease-out"
                   style={{ width: `${Math.min(100, (wind / 30) * 100)}%` }}
                 ></div>
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">blur_on</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Pollution Level</span>
                 </div>
                 <span className="text-xs font-bold text-on-surface">AQI {aqi}</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-red-400 transition-all duration-1000 ease-out"
                   style={{ width: `${Math.min(100, (aqi / 300) * 100)}%` }}
                 ></div>
              </div>
           </div>
        </div>

        {/* Dynamic Summary */}
        <div className="bg-surface-container-low/50 rounded-2xl p-5 border border-outline-variant/5">
           <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isStagnant ? 'bg-red-500' : 'bg-primary'}`}>
                 <Wind size={16} className="text-white" />
              </div>
              <p className="text-sm font-bold font-headline text-on-surface tracking-tight">Weather vs. AQI</p>
           </div>
           <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
             {isStagnant 
               ? "Winds are nearly stationary. This is causing particulate matter to pool in low-lying areas, significantly increasing exposure risk."
               : isDispersion
               ? "Strong atmospheric circulation is actively pushing pollutants away from the city center, maintaining safer air quality levels."
               : "A moderate breeze is providing some circulation, but local traffic emissions continue to maintain a steady pollution baseline."}
           </p>
        </div>
      </div>
    </div>
  );
}

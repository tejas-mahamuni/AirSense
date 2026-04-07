import { useState } from 'react';
import { useAQI, useWeather } from '@/hooks/useDataHooks';
import { validateAQI } from '@/utils/apiValidator';

export default function AQISimulator() {
  const { data: aqiData } = useAQI();
  const { data: weather } = useWeather();
  
  const baseAqi = validateAQI(aqiData?.aqi) ?? 50;
  const baseWind = weather?.wind_speed ?? 10;
  const baseTraffic = 50; // default 50%

  const [windSpeed, setWindSpeed] = useState(baseWind);
  const [trafficLevel, setTrafficLevel] = useState(baseTraffic);
  const [industryLvl, setIndustryLvl] = useState(50);

  // Simulation Logic:
  const windDiff = baseWind - windSpeed; // positive if wind dropped
  const trafficDiff = trafficLevel - baseTraffic;
  const indDiff = industryLvl - 50;

  // Simple pseudo-model
  const simulatedAqi = Math.max(10, Math.round(
    baseAqi 
    + (windDiff * 2) 
    + (trafficDiff * 0.8) 
    + (indDiff * 1.2)
  ));

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h2 className="text-lg font-bold font-headline text-on-surface mb-2">🧪 AQI Simulator Mode</h2>
      <p className="text-xs text-on-surface-variant font-body mb-6">
        Change environmental factors to see how they impact air quality in real-time.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-on-surface font-headline">🌬️ Wind Speed</label>
              <span className="text-xs font-bold text-primary font-headline">{windSpeed.toFixed(1)} km/h</span>
            </div>
            <input type="range" min="0" max="50" step="1" value={windSpeed} onChange={e => setWindSpeed(Number(e.target.value))} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-on-surface font-headline">🚗 Traffic Level</label>
              <span className="text-xs font-bold text-primary font-headline">{trafficLevel}%</span>
            </div>
            <input type="range" min="0" max="100" value={trafficLevel} onChange={e => setTrafficLevel(Number(e.target.value))} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-on-surface font-headline">🏭 Industrial Activity</label>
              <span className="text-xs font-bold text-primary font-headline">{industryLvl}%</span>
            </div>
            <input type="range" min="0" max="100" value={industryLvl} onChange={e => setIndustryLvl(Number(e.target.value))} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
          
          <button 
            onClick={() => { setWindSpeed(baseWind); setTrafficLevel(baseTraffic); setIndustryLvl(50); }}
            className="text-[10px] uppercase font-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest font-label"
          >
            Reset Simulation
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low rounded-[1.5rem] border border-outline-variant/10 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest font-label">Simulated AQI</p>
          <div className={`text-7xl font-black font-headline tracking-tighter mb-4 ${simulatedAqi > 100 ? 'text-red-500' : simulatedAqi > 50 ? 'text-orange-500' : 'text-green-500'}`}>
            {simulatedAqi}
          </div>
          
          <div className="bg-surface-container p-3 rounded-xl inline-block border border-outline-variant/10">
            <p className="text-xs font-medium text-on-surface font-body leading-relaxed text-center max-w-[200px]">
              {simulatedAqi > baseAqi + 20 ? "Conditions are worsening rapidly due to stagnation and high emissions." : simulatedAqi < baseAqi - 20 ? "Significant improvement in air quality from dispersion." : "Stable atmospheric conditions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

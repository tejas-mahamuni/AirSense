import { useAppStore } from '@/store/useAppStore';
import { useAQI, useWeather } from '@/hooks/useDataHooks';
import { validateAQI } from '@/utils/apiValidator';
import { getAQIColor } from '@/utils/colorMap';
import { Shield, Heart, Activity, Home, Wind, UserCircle2 } from 'lucide-react';

export default function HealthRecommendations() {
  const { data: aqiData } = useAQI();
  const { data: weather } = useWeather();
  const { persona, setPersona } = useAppStore();

  if (!aqiData) return null;

  const aqi = validateAQI(aqiData.aqi) ?? 0;

  const recs: { icon: React.ReactNode; title: string; desc: string }[] = [];

  // Adjust sensitivity threshold based on persona
  const isSensitive = persona === 'Asthma';
  const isRobust = persona === 'Athlete';
  
  if (aqi <= 50) {
    recs.push(
      { icon: <Activity size={16} />, title: 'Outdoor Exercise', desc: isRobust ? 'Perfect conditions for extreme sports.' : 'Great conditions for outdoor activities.' },
      { icon: <Home size={16} />, title: 'Open Windows', desc: 'Let the fresh air circulate through your home.' },
    );
  } else if (aqi <= 100) {
    recs.push(
      { icon: <Activity size={16} />, title: isSensitive ? 'Limit Activity' : 'Moderate Activity', desc: isSensitive ? 'Reduce prolonged outdoor exertion.' : (isRobust ? 'Fine for outdoor running.' : 'Reduce prolonged outdoor exertion if sensitive.') },
      { icon: <Home size={16} />, title: 'Ventilate Smartly', desc: 'Open windows early morning or late evening.' },
    );
  } else if (aqi <= 150) {
    recs.push(
      { icon: <Shield size={16} />, title: isSensitive ? 'Mask Required' : 'Wear a Mask', desc: isSensitive ? 'N95 mask strictly needed for you outdoors.' : 'N95 mask recommended for sensitive groups outdoors.' },
      { icon: <Activity size={16} />, title: isRobust ? 'Reduce Intensity' : 'Limit Exercise', desc: isRobust ? 'Limit cardio workouts.' : 'Move workouts indoors or reduce intensity.' },
      { icon: <Home size={16} />, title: 'Keep Windows Closed', desc: 'Use air purifiers if available.' },
    );
  } else {
    recs.push(
      { icon: <Shield size={16} />, title: 'N95 Mask Required', desc: 'Essential for anyone going outdoors.' },
      { icon: <Home size={16} />, title: 'Stay Indoors', desc: 'Limit all outdoor exposure. Run air purifiers.' },
      { icon: <Heart size={16} />, title: 'Health Alert', desc: isSensitive ? 'CRITICAL: People with asthma must stay fully indoors.' : 'People with respiratory conditions should take extra precaution.' },
      { icon: <Wind size={16} />, title: 'Air Purification', desc: 'Use HEPA filters. Keep indoor plants.' },
    );
  }

  const aqiColor = getAQIColor(aqi);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold font-headline text-on-surface">💡 Health Advisory</h2>
        
        <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant/20">
          <UserCircle2 size={14} className="text-on-surface-variant mr-2" />
          <select 
            value={persona} 
            onChange={(e) => setPersona(e.target.value as 'Normal' | 'Asthma' | 'Athlete')}
            className="bg-transparent text-xs font-medium text-on-surface focus:outline-none cursor-pointer appearance-none pr-2"
          >
            <option value="Normal">Normal</option>
            <option value="Asthma">Asthma / Sensitive</option>
            <option value="Athlete">Athlete</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recs.map((rec, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[1.5rem] p-5 flex items-start gap-3 shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow"
          >
            <div className="p-2 rounded-xl flex-shrink-0" style={{ background: aqiColor + '15' }}>
              <span style={{ color: aqiColor }}>{rec.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold font-headline text-on-surface">{rec.title}</p>
              <p className="text-xs text-on-surface-variant mt-0.5 font-body leading-relaxed">{rec.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

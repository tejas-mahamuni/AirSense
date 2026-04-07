import { useWeather } from '@/hooks/useDataHooks';
import { getWindDirection } from '@/utils/weatherIcons';

export default function WindCompass() {
  const { data: weather } = useWeather();
  if (!weather) return null;

  const deg = weather.wind_deg;
  const dir = getWindDirection(deg);
  const speed = weather.wind_speed;

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h3 className="text-sm font-semibold font-headline text-on-surface mb-4">🧭 Wind Direction</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Compass circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#acb3b5" strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#acb3b5" strokeWidth="0.5" opacity="0.15" />
            {/* Cardinal directions */}
            {['N', 'E', 'S', 'W'].map((d, i) => {
              const angle = i * 90 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 42;
              const y = 50 + Math.sin(rad) * 42;
              return (
                <text key={d} x={x} y={y + 3} textAnchor="middle" fill="#596062" fontSize="8" fontWeight="600">
                  {d}
                </text>
              );
            })}
            {/* Arrow */}
            <g style={{ transformOrigin: '50px 50px', transform: `rotate(${deg}deg)`, transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              <line x1="50" y1="50" x2="50" y2="18" stroke="#15696d" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="50,14 46,22 54,22" fill="#15696d" />
              <circle cx="50" cy="50" r="4" fill="#15696d" opacity="0.8" />
            </g>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold font-headline text-on-surface">{dir}</p>
          <p className="text-sm text-on-surface-variant font-body">{speed.toFixed(1)} km/h</p>
          <p className="text-xs text-outline mt-2 leading-relaxed font-body">
            {speed < 5
              ? 'Very calm winds — pollutants trapped near surface.'
              : speed < 15
              ? 'Light breeze helping with air circulation.'
              : 'Strong winds actively dispersing pollutants.'}
          </p>
        </div>
      </div>
    </div>
  );
}

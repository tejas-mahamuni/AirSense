import { useMemo } from 'react';

interface Props {
  aqi: number;
  hour: number;
}

export default function WalkingScene({ aqi, hour }: Props) {
  const isNight = hour < 6 || hour >= 20;
  const isSunset = hour >= 18 && hour < 20;
  const smogOpacity = Math.min(aqi / 350, 0.7);
  const walkDuration = aqi < 50 ? 7 : aqi < 100 ? 9 : aqi < 150 ? 12 : aqi < 200 ? 16 : 22;
  const showMask = aqi > 100;
  const showGoggles = aqi > 200;
  const isHunching = aqi > 150;

  const skyColor = isNight ? '#0a1628' : isSunset ? '#1a0a2e' : aqi <= 50 ? '#1B6CA8' : aqi <= 100 ? '#4A7C59' : aqi <= 150 ? '#C67C52' : '#6B0000';
  const sunColor = isNight ? '#E8E8E8' : isSunset ? '#FF9F0A' : '#FFD60A';

  const buildings = useMemo(() => [
    { x: 50, w: 60, h: 90 }, { x: 130, w: 45, h: 120 }, { x: 200, w: 70, h: 80 },
    { x: 300, w: 50, h: 140 }, { x: 380, w: 65, h: 95 }, { x: 470, w: 55, h: 110 },
    { x: 560, w: 40, h: 75 }, { x: 630, w: 60, h: 130 },
  ], []);

  return (
    <svg viewBox="0 0 800 220" className="w-full h-auto max-h-[180px] lg:max-h-[200px]" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
      {/* Sky */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyColor} />
          <stop offset="100%" stopColor={skyColor} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="800" height="220" fill="url(#sky)" style={{ transition: 'fill 2s ease' }} />

      {/* Sun/Moon */}
      <circle cx="700" cy="40" r="20" fill={sunColor} opacity="0.9">
        <animate attributeName="cy" values="40;36;40" dur="4s" repeatCount="indefinite" />
      </circle>
      {isNight && (
        <>
          <circle cx="694" cy="34" r="3" fill="#ccc" opacity="0.4" />
          <circle cx="706" cy="42" r="2" fill="#ccc" opacity="0.3" />
        </>
      )}

      {/* Stars at night */}
      {isNight && [1,2,3,4,5].map(i => (
        <circle key={i} cx={100 + i * 120} cy={20 + (i % 3) * 15} r="1" fill="white" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Smog */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={`smog-${i}`}
          cx={80 + i * 90}
          cy={140 + (i % 3) * 10}
          rx={20 + (i % 4) * 12}
          ry={8 + (i % 3) * 4}
          fill={`rgba(180,160,120,${smogOpacity})`}
          style={{ animation: `smogDrift ${4 + (i % 3) * 1.5}s ease-in-out ${i * 0.5}s infinite` }}
        />
      ))}

      {/* Buildings */}
      {buildings.map((b, i) => (
        <g key={`bld-${i}`}>
          <rect x={b.x} y={190 - b.h} width={b.w} height={b.h} fill="rgba(0,0,0,0.45)" rx="2" />
          {/* Windows */}
          {Array.from({ length: Math.floor(b.h / 18) }).map((_, wi) =>
            Array.from({ length: Math.floor(b.w / 16) }).map((_, wj) => (
              <rect
                key={`w-${i}-${wi}-${wj}`}
                x={b.x + 6 + wj * 16}
                y={190 - b.h + 8 + wi * 18}
                width="8"
                height="10"
                fill={(wi + wj + i) % 3 === 0 ? '#FFD60A' : 'rgba(255,255,255,0.1)'}
                opacity={0.7}
                rx="1"
                style={(wi + wj + i) % 3 === 0 ? { animation: `windowFlicker ${3 + (i + wi) % 5}s ease-in-out infinite` } : undefined}
              />
            ))
          )}
        </g>
      ))}

      {/* Trees */}
      {[160, 420, 590].map((tx, i) => (
        <g key={`tree-${i}`} style={{ transformOrigin: `${tx + 4}px 190px`, animation: `treeSway 3s ease-in-out infinite alternate` }}>
          <rect x={tx} y={165} width="8" height="25" fill="#3B2F1E" rx="2" />
          <circle cx={tx + 4} cy={158} r="18" fill="#2D5016" opacity="0.7" />
        </g>
      ))}

      {/* Road */}
      <rect x="0" y="190" width="800" height="30" fill="#1a1a2e" />
      <line x1="0" y1="205" x2="800" y2="205" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="25 15" />

      {/* Car */}
      <g style={{ animation: 'carDrive 12s linear infinite' }}>
        <rect x="0" y="194" width="45" height="16" fill="#2a2a4a" rx="4" />
        <rect x="5" y="188" width="20" height="8" fill="#2a2a4a" rx="3" />
        <circle cx="10" cy="212" r="4" fill="#333" />
        <circle cx="35" cy="212" r="4" fill="#333" />
        <rect x="42" y="198" width="4" height="4" fill="#FF453A" rx="1" opacity="0.8" />
      </g>

      {/* Walking character */}
      <g style={{ animation: `walkAcross ${walkDuration}s linear infinite` }}>
        {/* Body */}
        <g transform={isHunching ? 'rotate(-12, 0, 180)' : ''}>
          {/* Head */}
          <circle cx="0" cy="165" r="8" fill="#e0c8a0" />
          {/* Torso */}
          <rect x="-5" y="173" width="10" height="14" fill="#4488cc" rx="2" />
          {/* Arms */}
          <rect x="-7" y="174" width="3" height="10" fill="#e0c8a0" rx="1"
            style={{ transformOrigin: '-5.5px 174px', animation: 'armSwing 0.5s alternate infinite' }} />
          <rect x="4" y="174" width="3" height="10" fill="#e0c8a0" rx="1"
            style={{ transformOrigin: '5.5px 174px', animation: 'armSwing 0.5s alternate-reverse infinite' }} />
          {/* Legs */}
          <rect x="-4" y="187" width="3" height="12" fill="#333" rx="1"
            style={{ transformOrigin: '-2.5px 187px', animation: 'legSwing 0.5s alternate infinite' }} />
          <rect x="1" y="187" width="3" height="12" fill="#333" rx="1"
            style={{ transformOrigin: '2.5px 187px', animation: 'legSwing 0.5s alternate-reverse infinite' }} />
          {/* Mask */}
          {showMask && <rect x="-5" y="168" width="10" height="5" fill="white" rx="2" opacity="0.9" />}
          {/* Goggles */}
          {showGoggles && (
            <>
              <circle cx="-3" cy="164" r="3" fill="none" stroke="#666" strokeWidth="1.5" />
              <circle cx="3" cy="164" r="3" fill="none" stroke="#666" strokeWidth="1.5" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

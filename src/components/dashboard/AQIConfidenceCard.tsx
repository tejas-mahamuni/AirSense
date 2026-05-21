import React from 'react';
import { useAQI } from '@/hooks/useDataHooks';
import { formatDistanceToNow } from 'date-fns';

const AQIConfidenceCard: React.FC = () => {
  const { data: aqiData } = useAQI();

  if (!aqiData) return null;

  // Calculate confidence score based on source and freshness
  let confidence = 0;
  let statusColor = "text-primary";
  let bgStatus = "bg-primary/10";
  
  if (aqiData.source === 'WAQI') {
    confidence = aqiData.status === 'Live' ? 95 : aqiData.status === 'Outdated' ? 70 : 50;
  } else {
    // OpenWeather fallback
    confidence = 80; // Calculated from PM2.5, high confidence but not direct ground station
  }

  if (confidence < 75) {
    statusColor = "text-warning";
    bgStatus = "bg-warning/10";
  }
  if (confidence < 60) {
    statusColor = "text-error";
    bgStatus = "bg-error/10";
  }

  const timeAgo = aqiData.lastUpdated ? formatDistanceToNow(new Date(aqiData.lastUpdated), { addSuffix: true }) : 'unknown';

  return (
    <div className="glass-card rounded-[1.5rem] p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgStatus} ${statusColor}`}>
          <span className="material-symbols-outlined">verified_user</span>
        </div>
        <div>
          <h4 className="text-sm font-bold font-headline text-on-surface flex items-center gap-2">
            Data Trust Layer
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${bgStatus} ${statusColor} font-black uppercase tracking-widest`}>
              {confidence}% Confidence
            </span>
          </h4>
          <p className="text-xs text-on-surface-variant">
            Source: <span className="font-bold">{aqiData.source}</span> • Updated {timeAgo}
          </p>
        </div>
      </div>
      
      <div className="hidden sm:block text-right">
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Station Status</p>
        <p className={`text-sm font-black uppercase tracking-tight ${statusColor}`}>
          {aqiData.status}
        </p>
      </div>
    </div>
  );
};

export default AQIConfidenceCard;

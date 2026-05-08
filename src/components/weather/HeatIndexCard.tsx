import React from 'react';
import { motion } from 'framer-motion';
import { calculateHeatIndex, getHeatwaveSeverity } from '@/utils/heatwaveLogic';

interface HeatIndexCardProps {
  temp: number;
  humidity: number;
}

const HeatIndexCard: React.FC<HeatIndexCardProps> = ({ temp, humidity }) => {
  const heatIndex = calculateHeatIndex(temp, humidity);
  const severity = getHeatwaveSeverity(heatIndex);
  
  const colors: Record<string, string> = {
    'normal': '#34C759',
    'warm': '#FFD60A',
    'heatwave': '#FF9F0A',
    'severe-heatwave': '#FF453A'
  };

  const labels: Record<string, string> = {
    'normal': 'Normal',
    'warm': 'Warm',
    'heatwave': 'Heat Stress',
    'severe-heatwave': 'Severe Heat Stress'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10 flex flex-col justify-between h-full group hover:bg-surface-container transition-all"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">thermostat</span>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Feels Like</p>
          </div>
          <div 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: colors[severity] }}
          ></div>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black font-headline text-on-surface tracking-tighter transition-transform group-hover:scale-105 duration-500">
            {heatIndex}°C
          </span>
          <span className="text-sm font-bold text-outline">Heat Index</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-outline uppercase tracking-tighter">Status</span>
          <span className="text-sm font-bold text-on-surface leading-none">{labels[severity]}</span>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
          style={{ backgroundColor: colors[severity] + '20', color: colors[severity] }}
        >
          {humidity}% Humidity
        </div>
      </div>
    </motion.div>
  );
};

export default HeatIndexCard;

import React from 'react';
import { motion } from 'framer-motion';

interface TempAnomalyChartProps {
  actual: number;
}

const TempAnomalyChart: React.FC<TempAnomalyChartProps> = ({ actual }) => {
  const average = 32; // Mocked seasonal average
  const difference = actual - average;
  const isHigh = difference > 0;

  return (
    <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10">
      <div className="flex items-center gap-2 mb-8">
        <span className="material-symbols-outlined text-primary">bar_chart</span>
        <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest">Temp Anomaly</h3>
      </div>

      <div className="space-y-8">
        <div className="flex items-end justify-around gap-8 h-40 px-2 pb-6 border-b border-outline-variant/5">
          {/* Normal Bar */}
          <div className="flex flex-col items-center flex-1 max-w-[80px]">
            <span className="text-sm font-bold text-on-surface-variant mb-2">{average}°C</span>
            <div className="w-full bg-surface-container-highest rounded-t-2xl h-24 shadow-inner" />
            <span className="mt-3 text-[10px] font-black text-outline uppercase tracking-widest">Normal</span>
          </div>

          {/* Today Bar */}
          <div className="flex flex-col items-center flex-1 max-w-[80px]">
            <span className={`text-sm font-black mb-2 ${isHigh ? 'text-error' : 'text-primary'}`}>{actual}°C</span>
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(20, (actual / 45) * 100)}%` }}
              className={`w-full rounded-t-2xl relative ${isHigh ? 'bg-error shadow-[0_-8px_20px_-10px_rgba(255,69,58,0.5)]' : 'bg-primary shadow-[0_-8px_20px_-10px_rgba(52,199,89,0.5)]'}`}
            />
            <span className="mt-3 text-[10px] font-black text-on-surface uppercase tracking-widest">Today</span>
          </div>
        </div>

        <div className="p-4 rounded-[1.5rem] bg-surface-container-lowest border border-outline-variant/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-outline uppercase tracking-tighter mb-0.5">Departure</span>
            <span className={`text-xl font-black ${isHigh ? 'text-error' : 'text-primary'}`}>
              {isHigh ? '+' : ''}{difference.toFixed(1)}°C
            </span>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isHigh ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined font-bold">{isHigh ? 'trending_up' : 'trending_down'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempAnomalyChart;

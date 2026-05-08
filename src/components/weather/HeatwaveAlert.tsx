import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatwaveAlertProps {
  heatIndex: number;
}

const HeatwaveAlert: React.FC<HeatwaveAlertProps> = ({ heatIndex }) => {
  if (heatIndex < 40) return null;

  const isSevere = heatIndex >= 54;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={`w-full overflow-hidden rounded-[1.5rem] mb-6 ${isSevere ? 'bg-error' : 'bg-warning'}`}
      >
        <div className="p-4 flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-3xl animate-bounce">
              {isSevere ? 'emergency_home' : 'heat_warning'}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black font-headline uppercase tracking-widest leading-none mb-1">
              {isSevere ? 'Extreme Heat Emergency' : 'Heatwave Alert'}
            </h4>
            <p className="text-xs font-medium opacity-90 leading-tight">
              Dangerous heat levels detected ({heatIndex}°C Heat Index). Immediate precautions required.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest">
            {isSevere ? 'Level 4' : 'Level 2'}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HeatwaveAlert;

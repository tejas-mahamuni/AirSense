import React from 'react';
import { motion } from 'framer-motion';

interface ElNinoStatusProps {
  temp: number;
}

const ElNinoStatus: React.FC<ElNinoStatusProps> = ({ temp }) => {
  // Logic: Simulate based on temperature anomaly (mocking average of 30°C for calculation)
  const avgTemp = 30;
  const anomaly = temp - avgTemp;
  
  let status = "Neutral";
  let impact = "Standard seasonal conditions.";
  let color = "#34C759";
  let icon = "eco";

  if (anomaly > 3) {
    status = "Weak El Niño";
    impact = "Higher temperatures & dry conditions possible. Increased urban heat stress.";
    color = "#FF9F0A";
    icon = "wb_sunny";
  } else if (anomaly > 5) {
    status = "Strong El Niño";
    impact = "Extreme heat risks and reduced rainfall. Severe environmental impact.";
    color = "#FF453A";
    icon = "hot_tub";
  } else if (anomaly < -3) {
    status = "La Niña";
    impact = "Cooler temperatures and increased rainfall likelihood.";
    color = "#64D2FF";
    icon = "water_drop";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-6xl" style={{ color }}>{icon}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">public</span>
        <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest">Climate Status</h3>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-headline" style={{ color }}>{status}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant">
            {anomaly > 0 ? `+${anomaly.toFixed(1)}°C` : `${anomaly.toFixed(1)}°C`} Anomaly
          </span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
          {impact}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant/5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-tighter">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Research-oriented climate modeling
        </div>
      </div>
    </motion.div>
  );
};

export default ElNinoStatus;

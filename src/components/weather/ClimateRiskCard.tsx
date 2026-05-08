import React from 'react';
import { motion } from 'framer-motion';

interface ClimateRiskCardProps {
  aqi: number;
  heatIndex: number;
  humidity: number;
  windSpeed: number;
}

const ClimateRiskCard: React.FC<ClimateRiskCardProps> = ({ aqi, heatIndex, humidity, windSpeed }) => {
  // Calculate a mock Climate Risk Score (0-100)
  // Higher is worse
  const aqiScore = (aqi / 500) * 40;
  const heatScore = (Math.max(0, heatIndex - 25) / 30) * 40;
  const windScore = windSpeed < 5 ? 20 : 0; // Stagnant air increases risk
  
  const riskScore = Math.min(100, Math.round(aqiScore + heatScore + windScore));
  
  let riskLevel = "Low";
  let color = "#34C759";
  if (riskScore > 75) {
    riskLevel = "Extreme";
    color = "#FF453A";
  } else if (riskScore > 50) {
    riskLevel = "High";
    color = "#FF9F0A";
  } else if (riskScore > 25) {
    riskLevel = "Moderate";
    color = "#FFD60A";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 flex flex-col items-center text-center relative overflow-hidden group min-h-[350px] justify-center"
    >
      <div 
        className="absolute -bottom-20 -left-20 w-40 h-40 blur-[80px] opacity-10"
        style={{ background: color }}
      ></div>

      <h3 className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-6">Climate Risk Index</h3>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-container-highest"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={364.42}
            initial={{ strokeDashoffset: 364.42 }}
            animate={{ strokeDashoffset: 364.42 - (364.42 * riskScore) / 100 }}
            transition={{ duration: 2, ease: "circOut" }}
            style={{ color }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black font-headline text-on-surface">{riskScore}</span>
          <span className="text-[8px] font-bold text-outline uppercase tracking-widest">Score</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-black font-headline text-on-surface uppercase tracking-tight">{riskLevel} Risk</p>
        <p className="text-xs font-medium text-on-surface-variant leading-relaxed px-2">
          Composite environmental threat level based on pollution, heat, and atmospheric stagnation.
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        <div className="px-2 py-1 rounded-lg bg-surface-container-highest/50 text-[8px] font-bold text-on-surface-variant border border-outline-variant/5">AQI: {aqi}</div>
        <div className="px-2 py-1 rounded-lg bg-surface-container-highest/50 text-[8px] font-bold text-on-surface-variant border border-outline-variant/5">HEAT: {heatIndex}°C</div>
      </div>
    </motion.div>
  );
};

export default ClimateRiskCard;

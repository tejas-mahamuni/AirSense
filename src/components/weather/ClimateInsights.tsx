import React from 'react';
import { motion } from 'framer-motion';

interface ClimateInsightsProps {
  temp: number;
  humidity: number;
  windSpeed: number;
  aqi: number;
}

const ClimateInsights: React.FC<ClimateInsightsProps> = ({ temp, humidity, windSpeed, aqi }) => {
  const insights = [];

  if (humidity > 70) {
    insights.push({
      icon: 'water_drop',
      text: "High humidity is increasing discomfort levels and slowing down heat dissipation.",
      type: 'warning'
    });
  }

  if (windSpeed < 5) {
    insights.push({
      icon: 'air',
      text: "Low wind speed may trap pollutants and intensify local heat stress.",
      type: 'danger'
    });
  }

  if (temp > 38 && humidity < 30) {
    insights.push({
      icon: 'local_fire_department',
      text: "Arid heat conditions detected; urban heat island effect is likely peak.",
      type: 'danger'
    });
  }

  if (aqi > 150 && windSpeed < 10) {
    insights.push({
      icon: 'cloud',
      text: "Atmospheric stagnation is causing elevated pollution retention.",
      type: 'warning'
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: 'auto_awesome',
      text: "Current conditions indicate a stable and balanced local climate.",
      type: 'success'
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">psychology</span>
        <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest">Smart Climate Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant/5 flex gap-4 items-start group hover:bg-surface-container transition-all"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              insight.type === 'danger' ? 'bg-error/10 text-error' : 
              insight.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
            }`}>
              <span className="material-symbols-outlined">{insight.icon}</span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClimateInsights;

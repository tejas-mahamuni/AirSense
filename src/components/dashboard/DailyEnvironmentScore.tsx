import React from 'react';
import { useAQI, useWeather } from '@/hooks/useDataHooks';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';

export const DailyEnvironmentScore: React.FC = () => {
  const { data: aqiData } = useAQI();
  const { data: weatherData } = useWeather();

  if (!aqiData || !weatherData) return null;

  // Calculate a score out of 10 based on AQI and Weather
  // Ideal: AQI < 50, Temp ~ 22C, Humidity ~ 45%
  let score = 10;
  
  // AQI Deduction (0-50: -0, 50-100: -2, 100-150: -4, etc)
  if (aqiData.aqi > 50) score -= (aqiData.aqi - 50) / 30;
  
  // Temp Deduction (Ideal 22C)
  const tempDiff = Math.abs(weatherData.temp - 22);
  score -= tempDiff / 8;

  // Humidity Deduction (Ideal 45%)
  const humDiff = Math.abs(weatherData.humidity - 45);
  score -= humDiff / 25;

  score = Math.max(1, Math.min(10, score));

  let color = "#4CAF50";
  let label = "Excellent";
  if (score < 8) { color = "#FF9800"; label = "Moderate"; }
  if (score < 5) { color = "#F44336"; label = "Poor"; }
  if (score < 3) { color = "#9C27B0"; label = "Severe"; }

  const chartData = [{ name: 'Score', value: score, fill: color }];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-between"
    >
      <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 blur-xl rounded-full" style={{ background: color }}></div>
      
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Today's Environmental Score</h3>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-headline font-black text-on-surface" style={{ color }}>{score.toFixed(1)}</span>
          <span className="text-sm text-on-surface-variant font-bold mb-1">/ 10</span>
        </div>
        <p className="text-xs font-bold mt-1" style={{ color }}>{label} Conditions</p>
      </div>

      <div className="w-24 h-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={chartData} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: 'rgba(0,0,0,0.05)' }} cornerRadius={10} dataKey="value" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

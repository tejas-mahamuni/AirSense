import React from 'react';
import { HeatwaveAnalysis } from '@/utils/heatwaveLogic';
import { motion } from 'framer-motion';

interface HeatwaveAdvisorProps {
  analysis: HeatwaveAnalysis;
}

const HeatwaveAdvisor: React.FC<HeatwaveAdvisorProps> = ({ analysis }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-[2rem] border relative overflow-hidden ${
        analysis.severeAlert 
          ? 'bg-error-container/10 border-error/30 text-error' 
          : 'bg-surface-container-low border-outline-variant/10'
      }`}
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 blur-[60px] opacity-20"
        style={{ background: analysis.severityColor }}
      ></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-2xl" style={{ color: analysis.severityColor }}>
              {analysis.severity === 'normal' ? 'thermostat' : 'heat_warning'}
            </span>
            <h3 className="text-xl font-bold font-headline text-on-surface">Heatwave Advisory</h3>
          </div>
          <p className="text-xs text-on-surface-variant font-medium">Based on Heat Index & Humidity</p>
        </div>
        <div 
          className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm"
          style={{ background: analysis.severityColor, color: '#fff' }}
        >
          {analysis.severityLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-surface-container-highest/30 rounded-2xl p-4 border border-outline-variant/5">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Heat Index</p>
          <p className="text-3xl font-black font-headline text-on-surface">{analysis.heatIndex}°C</p>
        </div>
        <div className="bg-surface-container-highest/30 rounded-2xl p-4 border border-outline-variant/5">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Feels Like</p>
          <p className="text-3xl font-black font-headline text-on-surface">{analysis.feelsLike}°C</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 px-1">Outdoor Safety Rules</p>
          <div className="space-y-2">
            {analysis.outdoorSafety.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm font-medium text-on-surface-variant bg-surface-container/40 p-2 rounded-xl">
                <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                <span className="leading-tight">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeatwaveAdvisor;

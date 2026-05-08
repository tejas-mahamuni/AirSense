import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateClimatePrecautions, Precaution } from '@/utils/precautionEngine';

interface HumanPrecautionsProps {
  temp: number;
  humidity: number;
  heatIndex: number;
  aqi?: number;
  windSpeed?: number;
}

const HumanPrecautions: React.FC<HumanPrecautionsProps> = ({ 
  temp, 
  humidity, 
  heatIndex, 
  aqi = 0,
  windSpeed = 0
}) => {
  const list = generateClimatePrecautions(temp, humidity, heatIndex, aqi, windSpeed);

  const getPriorityLabel = (priority: Precaution['priority']) => {
    switch(priority) {
      case 'severe': return 'Severe Risk';
      case 'high': return 'High Risk';
      case 'medium': return 'Moderate';
      default: return 'Information';
    }
  };

  return (
    <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
          </div>
          <div>
            <h3 className="text-xl font-black font-headline text-on-surface tracking-tight leading-none mb-1">Safety Assistant</h3>
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">AI-Powered Environmental Advisor</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <AnimatePresence mode="wait">
          {list.length > 0 ? (
            <div className="space-y-4">
              {/* Heat Stress Alert Header */}
              {heatIndex > 40 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-3xl bg-error/10 border border-error/20 flex flex-col items-center text-center gap-2 mb-6"
                >
                  <span className="material-symbols-outlined text-error text-3xl animate-bounce">warning</span>
                  <h4 className="text-lg font-black text-error font-headline uppercase tracking-tighter">🚨 Heat Stress Alert</h4>
                  <p className="text-xs font-bold text-on-surface-variant">Current weather conditions may cause dehydration and fatigue.</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((p, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-on-surface-variant text-xl" style={{ color: p.severityColor }}>{p.icon}</span>
                      </div>
                      <span 
                        className="text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-outline-variant/10"
                        style={{ backgroundColor: p.severityColor + '15', color: p.severityColor }}
                      >
                        {getPriorityLabel(p.priority)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-on-surface leading-snug">
                      {p.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-12 h-full"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-5xl">task_alt</span>
              </div>
              <h4 className="text-2xl font-black font-headline text-on-surface tracking-tight mb-2">✅ Conditions are Optimal</h4>
              <p className="text-sm text-on-surface-variant max-w-xs mx-auto font-medium">
                Weather conditions are comfortable for outdoor activities. Stay hydrated and enjoy your day safely.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-outline-variant/10 flex justify-between items-center opacity-60">
        <span className="text-[10px] font-black text-outline uppercase tracking-widest">Real-time Safety Scan</span>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-75" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};

export default HumanPrecautions;

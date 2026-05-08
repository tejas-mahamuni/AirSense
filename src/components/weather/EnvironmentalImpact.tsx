import React from 'react';
import { motion } from 'framer-motion';

interface EnvironmentalImpactProps {
  temp: number;
  aqi: number;
  heatIndex: number;
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({ temp, aqi, heatIndex }) => {
  const impacts = [
    {
      title: "Ozone Formation",
      description: "High temperatures and sunlight are accelerating ground-level ozone production.",
      status: temp > 35 ? "Accelerated" : "Normal",
      color: temp > 35 ? "text-error" : "text-primary"
    },
    {
      title: "Air Dispersion",
      description: "Current atmospheric conditions are affecting how quickly pollutants are cleared.",
      status: aqi > 150 ? "Restricted" : "Efficient",
      color: aqi > 150 ? "text-error" : "text-primary"
    },
    {
      title: "Urban Heat Island",
      description: "Concrete and asphalt are retaining significant thermal energy.",
      status: heatIndex > 40 ? "Intense" : "Moderate",
      color: heatIndex > 40 ? "text-error" : "text-warning"
    }
  ];

  return (
    <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10">
      <div className="flex items-center gap-2 mb-8">
        <span className="material-symbols-outlined text-primary">eco</span>
        <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest">Environmental Impact Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {impacts.map((impact, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[2rem] bg-surface-container-lowest border border-outline-variant/5 flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-black text-on-surface uppercase tracking-tight">{impact.title}</h4>
                <span className={`text-[10px] font-black uppercase tracking-widest ${impact.color}`}>
                  {impact.status}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                {impact.description}
              </p>
            </div>
            
            <div className="mt-6 h-1 w-full bg-surface-container rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: impact.status === "Normal" || impact.status === "Efficient" || impact.status === "Moderate" ? "40%" : "90%" }}
                className={`h-full rounded-full ${impact.color.replace('text-', 'bg-')}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentalImpact;

import React from 'react';
import { motion } from 'framer-motion';

interface GovernmentAdvisoryProps {
  heatIndex: number;
}

const GovernmentAdvisory: React.FC<GovernmentAdvisoryProps> = ({ heatIndex }) => {
  const recommendations = [];

  if (heatIndex >= 40) {
    recommendations.push(
      { icon: '❄️', action: 'Open public cooling centers across high-risk zones', impact: 'High' },
      { icon: '💧', action: 'Increase roadside public water stations', impact: 'Medium' },
      { icon: '📢', action: 'Issue mandatory heatwave health alerts via media', impact: 'High' }
    );
  } else {
    recommendations.push(
      { icon: '🌳', action: 'Increase urban tree cover to mitigate future heat island effects', impact: 'Long-term' },
      { icon: '🏠', action: 'Promote reflective roofing and green corridor development', impact: 'Long-term' }
    );
  }

  return (
    <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary">account_balance</span>
        <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest">Gov. Climate Advisory</h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((r, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-highest/20 border border-outline-variant/5"
          >
            <span className="text-xl shrink-0">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface leading-tight mb-1">{r.action}</p>
              <span className="text-[9px] font-black uppercase text-outline tracking-tighter">Priority: {r.impact}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentAdvisory;

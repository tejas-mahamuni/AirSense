import React from 'react';
import { AreaImprovementFactor } from '@/utils/pollutionImpact';
import { motion } from 'framer-motion';

interface LocationInsightsProps {
  factors: AreaImprovementFactor[];
}

const LocationInsights: React.FC<LocationInsightsProps> = ({ factors }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">insights</span>
        <h3 className="text-lg font-bold font-headline text-on-surface">Environmental Action Plan</h3>
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-outline-variant/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/10">
              <th className="px-4 py-3 text-[10px] font-bold text-outline uppercase tracking-widest">Problem</th>
              <th className="px-4 py-3 text-[10px] font-bold text-outline uppercase tracking-widest">Action Required</th>
              <th className="px-4 py-3 text-[10px] font-bold text-outline uppercase tracking-widest text-right">Potential</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5 bg-surface-container-lowest">
            {factors.map((factor, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-surface-container/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{factor.icon}</span>
                    <span className="text-xs font-bold text-on-surface">{factor.problem}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[11px] font-medium text-on-surface-variant leading-tight">{factor.action}</p>
                  <p className="text-[9px] text-outline mt-1 font-bold">Timeframe: {factor.timeframe}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-black text-primary">-{factor.potentialAQIReduction}%</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationInsights;

import React from 'react';
import { GovernmentAction } from '@/utils/remedyEngine';
import { motion } from 'framer-motion';

interface GovernmentActionsProps {
  actions: GovernmentAction[];
}

const GovernmentActions: React.FC<GovernmentActionsProps> = ({ actions }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">account_balance</span>
        <h3 className="text-lg font-bold font-headline text-on-surface">Government Actions</h3>
      </div>
      <div className="space-y-3">
        {actions.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-between gap-4 group hover:bg-surface-container transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface mb-0.5">{item.action}</p>
                <p className="text-[11px] text-on-surface-variant/70 italic">Effect: {item.estimatedEffect}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                item.impact === 'high' ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {item.impact} Impact
              </span>
              <span className="text-[10px] text-outline uppercase font-bold tracking-tighter opacity-50">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentActions;

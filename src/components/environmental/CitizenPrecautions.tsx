import React from 'react';
import { PrecautionItem } from '@/utils/remedyEngine';
import { motion } from 'framer-motion';

interface CitizenPrecautionsProps {
  precautions: PrecautionItem[];
}

const CitizenPrecautions: React.FC<CitizenPrecautionsProps> = ({ precautions }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">person_check</span>
        <h3 className="text-lg font-bold font-headline text-on-surface">Citizen Precautions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {precautions.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
              item.priority === 'critical'
                ? 'bg-error-container/10 border-error/20 text-error'
                : item.priority === 'high'
                ? 'bg-warning-container/10 border-warning/20 text-warning'
                : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-medium leading-tight">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CitizenPrecautions;

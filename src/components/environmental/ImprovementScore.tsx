import React from 'react';
import { ImprovementScoreResult } from '@/utils/pollutionImpact';
import { motion } from 'framer-motion';

interface ImprovementScoreProps {
  scoreData: ImprovementScoreResult;
}

const ImprovementScore: React.FC<ImprovementScoreProps> = ({ scoreData }) => {
  return (
    <div className="p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/10">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary">trending_up</span>
        <h3 className="text-lg font-bold font-headline text-on-surface">Area Improvement Score</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
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
              animate={{ strokeDashoffset: 364.42 - (364.42 * scoreData.potentialImprovement) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-headline text-on-surface">{scoreData.potentialImprovement}%</span>
            <span className="text-[8px] font-bold text-outline uppercase tracking-tighter">Potential</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container rounded-2xl p-3 text-center border border-outline-variant/5">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-0.5">Current AQI</p>
              <p className="text-xl font-bold text-on-surface">{scoreData.currentAQI}</p>
            </div>
            <div className="bg-primary/10 rounded-2xl p-3 text-center border border-primary/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Target AQI</p>
              <p className="text-xl font-bold text-primary">{scoreData.estimatedTargetAQI}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
            This area can reduce pollution by <span className="text-primary font-bold">{scoreData.potentialImprovement}%</span> if recommended traffic and dust control measures are strictly implemented.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovementScore;

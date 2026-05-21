import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsightCardProps {
  title: string;
  content: string | undefined;
  isLoading: boolean;
  isError: boolean;
  icon?: string;
  fallbackContent?: React.ReactNode;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ 
  title, 
  content, 
  isLoading, 
  isError, 
  icon = 'auto_awesome',
  fallbackContent 
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="glass-card rounded-[2rem] p-6 !border-primary/20 relative overflow-hidden hover:!border-primary/40 transition-all group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
          </div>
          <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest flex items-center gap-2">
            {title}
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-black text-primary tracking-widest uppercase border border-primary/20">AI</span>
          </h3>
        </div>
        <button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors text-on-surface-variant">
          <span className={`material-symbols-outlined transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 overflow-hidden"
          >
            {isLoading ? (
              <div className="space-y-2 mt-2">
                <div className="h-4 bg-surface-container rounded-md w-full animate-pulse" />
                <div className="h-4 bg-surface-container rounded-md w-5/6 animate-pulse" />
                <div className="h-4 bg-surface-container rounded-md w-4/6 animate-pulse" />
              </div>
            ) : isError || !content ? (
              <div className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                {fallbackContent || "Could not generate AI insight at this moment."}
              </div>
            ) : (
              <div className="mt-2 text-sm text-on-surface font-medium leading-relaxed">
                {/* Check if bullet points, format appropriately if so */}
                {content.includes('•') ? (
                  <ul className="space-y-2">
                    {content.split('•').filter(Boolean).map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="flex-1">{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{content}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInsightCard;

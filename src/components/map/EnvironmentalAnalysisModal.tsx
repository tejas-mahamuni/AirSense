import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRemedies } from '@/utils/remedyEngine';
import { analyzeHeatwave } from '@/utils/heatwaveLogic';
import { calculateImprovementScore, analyzePollutantContributions } from '@/utils/pollutionImpact';
import { useAIExtendedRemedies } from '@/hooks/useAIInsights';
import CitizenPrecautions from '../environmental/CitizenPrecautions';
import GovernmentActions from '../environmental/GovernmentActions';
import HeatwaveAdvisor from '../environmental/HeatwaveAdvisor';
import ImprovementScore from '../environmental/ImprovementScore';
import LocationInsights from '../environmental/LocationInsights';


interface EnvironmentalAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    stationName: string;
    aqi: number;
    pollutants: Record<string, { v: number }>;
    weather?: {
      temp: number;
      humidity: number;
      wind_speed: number;
    };
    lastUpdated: string;
    source: string;
  };
}

const EnvironmentalAnalysisModal: React.FC<EnvironmentalAnalysisModalProps> = ({ isOpen, onClose, data }) => {
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAiEnabled(false);
    }
  }, [isOpen, data.stationName]);

  const remedies = useMemo(() => 
    generateRemedies(
      data.aqi, 
      data.pollutants, 
      data.weather?.temp, 
      data.weather?.humidity, 
      data.weather?.wind_speed
    ), [data]);

  const { data: aiRemedies, isLoading: isAiLoading, isError: isAiError } = useAIExtendedRemedies(
    data.aqi,
    data.pollutants,
    data.weather,
    data.stationName,
    aiEnabled
  );

  const heatwave = useMemo(() => 
    data.weather ? analyzeHeatwave(data.weather.temp, data.weather.humidity) : null, 
    [data.weather]);

  const improvement = useMemo(() => 
    calculateImprovementScore(
      data.aqi, 
      data.pollutants, 
      data.weather?.wind_speed || 0, 
      data.weather?.temp || 0, 
      data.weather?.humidity || 0
    ), [data]);

  const contributions = useMemo(() => 
    analyzePollutantContributions(data.pollutants, data.aqi), 
    [data.pollutants, data.aqi]);

  // Dynamically select AI lists if loaded, otherwise fallback immediately to static rules
  const citizenPrecautionsList = aiRemedies?.citizenPrecautions || remedies.citizen;
  const governmentActionsList = aiRemedies?.governmentActions || remedies.government;
  const sustainabilityList = aiRemedies?.sustainabilityVision || remedies.sustainability;

  if (!isOpen) return null;


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-2xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-6xl h-full max-h-[90vh] glass-modal rounded-[3rem] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-outline-variant/5 bg-surface-container-lowest/50 sticky top-0 z-20">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">Environmental Intelligence</h2>
              </div>
              <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {data.stationName} • Last Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center justify-center group"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:rotate-90 transition-transform">close</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column - Core Data & Analysis */}
              <div className="lg:col-span-4 space-y-8">
                {/* AQI Overview Card */}
                <div className="p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/5 relative overflow-hidden group">
                  <div 
                    className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-10"
                    style={{ background: remedies.riskColor }}
                  ></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-2">Live AQI Value</p>
                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="text-7xl font-black font-headline tracking-tighter" style={{ color: remedies.riskColor }}>{data.aqi}</span>
                      <div 
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                        style={{ background: remedies.riskColor + '20', color: remedies.riskColor }}
                      >
                        {remedies.riskLabel}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Risk Factors Detected</p>
                      <div className="flex flex-wrap gap-2">
                        {remedies.detectedRisks.map((risk, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-surface-container-highest/50 text-[11px] font-bold text-on-surface-variant border border-outline-variant/5">
                            {risk}
                          </span>
                        ))}
                        {remedies.detectedRisks.length === 0 && (
                          <span className="text-xs font-medium text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            Atmosphere is stable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pollutant Breakdown */}
                <div className="p-6 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10">
                  <h3 className="text-sm font-bold font-headline text-on-surface mb-4 uppercase tracking-widest">Pollutant contribution</h3>
                  <div className="space-y-4">
                    {contributions.map((pollutant, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter">
                          <span className="text-on-surface">{pollutant.name}</span>
                          <span className="text-outline">{pollutant.value.toFixed(2)} {pollutant.unit}</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pollutant.percentage}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: pollutant.color }}
                          />
                        </div>
                        <p className="text-[9px] text-on-surface-variant/60 leading-tight">{pollutant.primarySource}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatwave Card */}
                {heatwave && <HeatwaveAdvisor analysis={heatwave} />}
              </div>

              {/* Right Column - Recommendations & Action Plans */}
              <div className="lg:col-span-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ImprovementScore scoreData={improvement} />
                  <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex flex-col justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">eco</span>
                    <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Sustainability Vision</h3>
                    <ul className="space-y-2">
                      {sustainabilityList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Deep Analysis Panel */}
                <div className="p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden bg-surface-container-low border-outline-variant/10">
                  {/* Decorative glowing gradient */}
                  {aiEnabled && !isAiError && (
                    <div className="absolute -inset-10 bg-gradient-to-r from-primary/10 via-secondary/15 to-tertiary/10 blur-[40px] opacity-70 pointer-events-none" />
                  )}
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`material-symbols-outlined text-3xl ${aiEnabled && isAiLoading ? 'animate-pulse text-tertiary' : 'text-primary'}`}>
                          {aiEnabled ? (isAiLoading ? 'psychology' : 'neurology') : 'auto_awesome'}
                        </span>
                        <h4 className="text-xl font-black font-headline text-on-surface tracking-tight flex items-center gap-2">
                          Llama 3.3 AI Advisor
                          {aiEnabled && !isAiLoading && !isAiError && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-primary/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                              Active
                            </span>
                          )}
                        </h4>
                      </div>
                      <p className="text-sm text-on-surface-variant font-medium max-w-xl">
                        {aiEnabled 
                          ? (isAiLoading 
                              ? 'Consulting climate intelligence servers to run customized micro-simulations...' 
                              : isAiError 
                                ? 'An error occurred while communicating with the AI. Fallback rules are active.' 
                                : 'Tailored high-precision advisory generated for the current pollutant footprint.')
                          : 'Unlock bespoke local safety protocols, city-scale CPCB policy recommendations, and dynamic sustainability suggestions powered by high-capacity machine intelligence.'
                        }
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex items-center">
                      {!aiEnabled ? (
                        <button
                          onClick={() => setAiEnabled(true)}
                          className="px-6 py-3 rounded-2xl bg-primary text-on-primary hover:bg-primary/95 font-bold text-sm tracking-tight flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 group"
                        >
                          <span>Consult Llama AI</span>
                          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setAiEnabled(false)}
                          className="px-5 py-2.5 rounded-2xl bg-surface-container-highest text-on-surface-variant font-bold text-xs hover:bg-surface-container-highest/80 transition-all border border-outline-variant/10"
                        >
                          Clear AI Advisory
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Results Content */}
                  {aiEnabled && (
                    <div className="mt-6 border-t border-outline-variant/10 pt-6 relative z-10">
                      {isAiLoading && (
                        <div className="space-y-4 animate-pulse">
                          <div className="h-4 bg-surface-container-highest rounded-md w-3/4" />
                          <div className="h-4 bg-surface-container-highest rounded-md w-1/2" />
                          <div className="h-10 bg-surface-container-highest/30 rounded-2xl w-full mt-4 flex items-center justify-center text-xs font-semibold text-on-surface-variant/50">
                            Fetching dynamic environment recommendations...
                          </div>
                        </div>
                      )}

                      {isAiError && (
                        <div className="p-4 rounded-2xl bg-error-container/10 border border-error/20 flex items-center gap-3 text-error">
                          <span className="material-symbols-outlined">warning</span>
                          <div className="flex-1 text-xs font-bold leading-snug">
                            Unable to fetch AI recommendations. Standard rules-engine remedies remain active below.
                          </div>
                          <button
                            onClick={() => {
                              setAiEnabled(false);
                              setTimeout(() => setAiEnabled(true), 50);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-error/10 hover:bg-error/15 text-xs font-black uppercase transition-colors"
                          >
                            Retry Query
                          </button>
                        </div>
                      )}

                      {aiRemedies && !isAiLoading && !isAiError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="p-5 rounded-2.5xl bg-surface-container-lowest/80 border border-outline-variant/5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">Executive Environmental Briefing</span>
                            <p className="text-sm font-semibold text-on-surface leading-relaxed italic">
                              "{aiRemedies.summary}"
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                <CitizenPrecautions precautions={citizenPrecautionsList} />
                
                <GovernmentActions actions={governmentActionsList} />

                <LocationInsights factors={improvement.factors} />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-surface-container-low border-t border-outline-variant/5 text-center">
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.3em]">
              Powered by AirSense Intelligence • Source: {data.source}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnvironmentalAnalysisModal;

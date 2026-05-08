import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRemedies } from '@/utils/remedyEngine';
import { analyzeHeatwave } from '@/utils/heatwaveLogic';
import { calculateImprovementScore, analyzePollutantContributions } from '@/utils/pollutionImpact';
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
  const remedies = useMemo(() => 
    generateRemedies(
      data.aqi, 
      data.pollutants, 
      data.weather?.temp, 
      data.weather?.humidity, 
      data.weather?.wind_speed
    ), [data]);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-6xl h-full max-h-[90vh] bg-surface-container-lowest rounded-[3rem] shadow-2xl border border-outline-variant/10 flex flex-col overflow-hidden"
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
                          <span className="text-outline">{pollutant.value} {pollutant.unit}</span>
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
                      {remedies.sustainability.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <CitizenPrecautions precautions={remedies.citizen} />
                
                <GovernmentActions actions={remedies.government} />

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

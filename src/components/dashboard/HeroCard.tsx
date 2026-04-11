import React, { useState } from 'react';
import { useAQI, useWeather } from '@/hooks/useDataHooks';
import { getAQIColor, getAQIText } from '@/utils/colorMap';
import { getStatusTheme } from '@/utils/aqiUtils';
import { toast } from 'sonner';

const HeroCard = () => {
  const { data: aqiData, isLoading: aqiLoading } = useAQI();
  const { data: weatherData, isLoading: weatherLoading } = useWeather();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  if (aqiLoading || weatherLoading) {
    return <div className="lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] p-10 shadow-sm flex items-center justify-center animate-pulse h-80">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-medium">Fetching real-time data...</p>
      </div>
    </div>;
  }

  if (!aqiData) {
    return <div className="lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] p-10 shadow-sm border border-outline-variant/10 text-center">
      <span className="material-symbols-outlined text-outline text-4xl mb-4 opacity-20">cloud_off</span>
      <h3 className="text-xl font-bold font-headline mb-2">Data Unavailable</h3>
      <p className="text-on-surface-variant max-w-xs mx-auto">No monitoring station found in this area. Showing estimated AQI if available.</p>
    </div>;
  }

  const aqiValue = aqiData.aqi || 0;
  const aqiColor = getAQIColor(aqiValue);
  const aqiText = getAQIText(aqiValue);
  const statusTheme = getStatusTheme(aqiData.status);

  const handleFeedbackSubmit = (type: string) => {
    setFeedbackGiven(type);
    setShowFeedback(false);
    toast.success("Thank you for your feedback!", {
      description: `You reported: ${type}`
    });
  };

  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/5 relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 transition-colors duration-1000"
        style={{ background: aqiColor }}
      ></div>

      {/* Header with Status Badge */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            <h2 className="text-2xl font-bold font-headline text-on-surface truncate">{aqiData.city?.name || 'Unknown Location'}</h2>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <span 
              className="text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all"
              style={{ 
                background: statusTheme.color + '15', 
                borderColor: statusTheme.color + '30',
                color: statusTheme.color 
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusTheme.color }}></span>
              {statusTheme.label}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-outline-variant/20 bg-surface-container-low text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">source</span>
              Source: {aqiData.source === 'OpenWeather' ? 'OpenWeather (Estimated)' : 'WAQI Station'}
            </span>
            
            {/* Feedback Button */}
            <div className="relative">
              <button 
                onClick={() => setShowFeedback(!showFeedback)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${feedbackGiven ? 'border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'}`}
              >
                {feedbackGiven ? <span className="text-[12px]">✅</span> : <span className="material-symbols-outlined text-[12px]">feedback</span>}
                {feedbackGiven ? 'Rated' : 'Rate Air'}
              </button>
              
              {showFeedback && (
                <div className="absolute top-full left-0 mt-2 bg-surface p-3 rounded-2xl shadow-xl border border-outline-variant/10 z-50 w-48 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">
                    {feedbackGiven ? "Change Rating?" : "How is the air?"}
                  </p>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handleFeedbackSubmit("Clean")} className={`text-xs text-left px-2 py-1.5 rounded-lg transition-colors ${feedbackGiven === 'Clean' ? 'bg-surface-container-highest font-bold' : 'hover:bg-surface-container'}`}>✨ Feels Clean</button>
                    <button onClick={() => handleFeedbackSubmit("Smoggy")} className={`text-xs text-left px-2 py-1.5 rounded-lg transition-colors ${feedbackGiven === 'Smoggy' ? 'bg-surface-container-highest font-bold' : 'hover:bg-surface-container'}`}>🌫️ Smoggy/Hazy</button>
                    <button onClick={() => handleFeedbackSubmit("Bad Smell")} className={`text-xs text-left px-2 py-1.5 rounded-lg transition-colors ${feedbackGiven === 'Bad Smell' ? 'bg-surface-container-highest font-bold' : 'hover:bg-surface-container'}`}>🤢 Bad Smell</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
            <div className="flex items-baseline gap-4">
              <span 
                className="text-8xl md:text-9xl font-black leading-none tracking-tighter sm:tracking-[-0.05em] font-headline transition-all duration-500 group-hover:scale-105"
                style={{ color: aqiColor }}
              >
                {aqiValue}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xl md:text-2xl font-bold font-headline text-on-surface uppercase leading-tight">{aqiText}</span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">Air Quality Index</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-on-surface-variant font-medium font-body border-t border-outline-variant/5 pt-6 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-lg">cyclone</span>
              <span>Wind: {weatherData?.wind_speed || 0} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-lg">thermostat</span>
              <span>Temp: {weatherData?.temp || 0}°C</span>
            </div>
          </div>
        </div>

        {/* Action / Visual Column */}
        <div className="hidden sm:flex flex-col items-end gap-6 flex-shrink-0">
          <div className="w-48 h-56 relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <img 
              alt="Environmental snapshot" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2913&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Last Update</p>
              <p className="text-sm text-white font-bold">{new Date(aqiData.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-on-surface text-surface px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95 print:hidden"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;

import React from "react";
import { useAQI, useWeather } from "@/hooks/useDataHooks";
import { generateInsights, SmartInsight } from "@/utils/insightRules";

const InsightEngine = () => {
  const { data: aqiData, isLoading: aqiLoading } = useAQI();
  const { data: weatherData, isLoading: weatherLoading } = useWeather();

  if (aqiLoading || weatherLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm animate-pulse h-64 border border-outline-variant/10">
        <div className="w-48 h-6 bg-outline-variant/20 rounded-lg mb-6"></div>
        <div className="w-full h-24 bg-outline-variant/10 rounded-2xl mb-4"></div>
        <div className="w-2/3 h-6 bg-outline-variant/10 rounded-lg"></div>
      </div>
    );
  }

  if (!aqiData || !weatherData) return null;

  const insights: SmartInsight = generateInsights({
    aqi: aqiData.aqi,
    windSpeed: weatherData.wind_speed,
    temperature: weatherData.temp,
    humidity: weatherData.humidity,
    dominantPollutant: aqiData.dominantPollutant || "pm25",
  });

  const getTheme = () => {
    switch (insights.type) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-900",
          icon: "🚨",
        };
      case "unfavorable":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-900",
          icon: "⚠️",
        };
      default:
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-900",
          icon: "✅",
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-10">
        {/* Left Side: "Why?" Insight */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{theme.icon}</span>
            <h2 className="text-xl font-bold font-headline text-on-surface">
              Intelligent Insights
            </h2>
          </div>

          <div
            className={`p-6 rounded-[2rem] border-2 ${theme.bg} ${theme.border} mb-6 transition-all duration-500 hover:shadow-md`}
          >
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-2">
              Diagnostic Observation
            </p>
            <p
              className={`text-lg font-bold font-headline ${theme.text} leading-snug`}
            >
              {insights.reason}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">
              info
            </span>
            <p className="text-xs text-on-surface-variant font-medium">
              Insights generated based on real-time meteorological sensor data.
            </p>
          </div>
        </div>

        {/* Right Side: "What to do?" Recommendation */}
        <div className="flex-1 bg-surface-container-low/50 rounded-[2rem] p-8 border border-outline-variant/5">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-xl">
              health_and_safety
            </span>
            <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest">
              Health Action Plan
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-on-surface font-medium leading-relaxed bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10">
              {insights.recommendation}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white p-3 rounded-2xl border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">
                  mask
                </span>
                <p className="text-[8px] font-bold uppercase tracking-tighter text-outline">
                  Mask Need
                </p>
                <p className="text-[11px] font-bold">
                  {aqiData.aqi > 100 ? "High" : "Low"}
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">
                  window
                </span>
                <p className="text-[8px] font-bold uppercase tracking-tighter text-outline">
                  Windows
                </p>
                <p className="text-[11px] font-bold">
                  {aqiData.aqi > 100 ? "Close" : "Open"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightEngine;

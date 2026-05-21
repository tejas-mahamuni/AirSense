import React from 'react';
import AIInsightCard from './AIInsightCard';
import { useAIAQISummary } from '@/hooks/useAIInsights';
import { useAQI } from '@/hooks/useDataHooks';
import { generateInsights } from '@/utils/insightRules';

const AIAQISummary: React.FC = () => {
  const { data: aiContent, isLoading, isError } = useAIAQISummary();
  const { data: aqiData } = useAQI();

  // Fallback to rule-based insight if AI fails or is loading
  const fallbackInsight = aqiData 
    ? generateInsights({ 
        aqi: aqiData.aqi,
        windSpeed: 0, 
        temperature: 0, 
        humidity: 0, 
        dominantPollutant: aqiData.dominantPollutant || 'pm25'
      }).reason || 'Air quality data is currently being analyzed.'
    : 'No AQI data available for analysis.';

  return (
    <AIInsightCard 
      title="AQI Intelligence" 
      icon="air" 
      content={aiContent} 
      isLoading={isLoading} 
      isError={isError}
      fallbackContent={fallbackInsight}
    />
  );
};

export default AIAQISummary;

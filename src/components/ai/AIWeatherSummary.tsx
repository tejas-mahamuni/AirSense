import React from 'react';
import AIInsightCard from './AIInsightCard';
import { useAIWeatherSummary } from '@/hooks/useAIInsights';
import { useWeather } from '@/hooks/useDataHooks';

const AIWeatherSummary: React.FC = () => {
  const { data: aiContent, isLoading, isError } = useAIWeatherSummary();
  const { data: weatherData } = useWeather();

  const fallbackInsight = weatherData 
    ? `Current conditions are ${weatherData.description} with a temperature of ${weatherData.temp}°C.` 
    : 'No weather forecast available for analysis.';

  return (
    <AIInsightCard 
      title="Climate Forecast Analysis" 
      icon="routine" 
      content={aiContent} 
      isLoading={isLoading} 
      isError={isError}
      fallbackContent={fallbackInsight}
    />
  );
};

export default AIWeatherSummary;

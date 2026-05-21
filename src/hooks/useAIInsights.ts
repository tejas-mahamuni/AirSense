import { useQuery } from '@tanstack/react-query';
import { useAQI, useWeather, useForecast } from './useDataHooks';
import { useAppStore } from '@/store/useAppStore';
import { generateAIInsight } from '@/services/ai/groqClient';
import { buildAQISummaryPrompt, buildWeatherSummaryPrompt, buildDailyBriefingPrompt } from '@/services/ai/prompts';

export function useAIAQISummary() {
  const { data: aqiData } = useAQI();
  const { data: weatherData } = useWeather();
  const persona = useAppStore(s => s.persona);

  return useQuery({
    queryKey: ['ai', 'aqi-summary', aqiData?.aqi, weatherData?.temp, persona],
    queryFn: async () => {
      if (!aqiData || !weatherData) throw new Error('Data not ready');
      const prompt = buildAQISummaryPrompt(aqiData, weatherData, persona);
      return await generateAIInsight(prompt);
    },
    enabled: !!aqiData && !!weatherData,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    retry: 1,
  });
}

export function useAIWeatherSummary() {
  const { data: weatherData } = useWeather();
  const { data: forecastData } = useForecast();
  const location = useAppStore(s => s.location);

  return useQuery({
    queryKey: ['ai', 'weather-summary', weatherData?.temp, location?.city],
    queryFn: async () => {
      if (!weatherData || !forecastData || !location) throw new Error('Data not ready');
      const prompt = buildWeatherSummaryPrompt(weatherData, forecastData, location.city);
      return await generateAIInsight(prompt);
    },
    enabled: !!weatherData && !!forecastData && !!location,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    retry: 1,
  });
}

export function useAIDailyBriefing() {
  const { data: aqiData } = useAQI();
  const { data: weatherData } = useWeather();
  const location = useAppStore(s => s.location);
  const hour = new Date().getHours();
  const isMorning = hour < 12;

  return useQuery({
    queryKey: ['ai', 'daily-briefing', location?.city, isMorning],
    queryFn: async () => {
      if (!aqiData || !weatherData || !location) throw new Error('Data not ready');
      const prompt = buildDailyBriefingPrompt(aqiData, weatherData, location.city, isMorning);
      return await generateAIInsight(prompt);
    },
    enabled: !!aqiData && !!weatherData && !!location,
    staleTime: 4 * 60 * 60 * 1000, // Cache for 4 hours (morning vs evening)
    retry: 1,
  });
}

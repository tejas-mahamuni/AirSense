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
  
  let timeOfDay: 'Early Morning' | 'Morning' | 'Afternoon' | 'Evening' | 'Night' = 'Night';
  if (hour >= 4 && hour < 5) {
    timeOfDay = 'Early Morning';
  } else if (hour >= 5 && hour < 12) {
    timeOfDay = 'Morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Afternoon';
  } else if (hour >= 17 && hour < 20) {
    timeOfDay = 'Evening';
  }

  return useQuery({
    queryKey: ['ai', 'daily-briefing', location?.city, timeOfDay],
    queryFn: async () => {
      if (!aqiData || !weatherData || !location) throw new Error('Data not ready');
      const prompt = buildDailyBriefingPrompt(aqiData, weatherData, location.city, timeOfDay);
      return await generateAIInsight(prompt);
    },
    enabled: !!aqiData && !!weatherData && !!location,
    staleTime: 4 * 60 * 60 * 1000, // Cache for 4 hours (morning vs afternoon vs evening etc)
    retry: 1,
  });
}

export function useAIExtendedRemedies(
  aqi: number,
  pollutants: any,
  weather: any,
  city: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ['ai', 'extended-remedies', city, aqi, enabled],
    queryFn: async () => {
      if (!aqi || !city) throw new Error('Data not ready');
      
      const pm25 = pollutants?.pm25?.v || 0;
      const pm10 = pollutants?.pm10?.v || 0;
      const temp = weather?.temp || 0;
      const humidity = weather?.humidity || 0;
      const windSpeed = weather?.wind_speed || 0;

      const prompt = `You are a professional environmental intelligence AI analyzing the air quality of ${city}.
Current Parameters:
- AQI: ${aqi}
- PM2.5: ${pm25} µg/m³
- PM10: ${pm10} µg/m³
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} m/s

Task: Generate a highly contextual, dynamic, and safety-verified set of environmental precautions and actions.
Respond with a JSON object conforming exactly to this schema:
{
  "summary": "A 2-sentence highly contextual executive summary of current environmental health conditions.",
  "citizenPrecautions": [
    { "icon": "😷", "text": "Specific, practical citizen precaution tip based on current PM/Ozone levels.", "priority": "high" }
  ],
  "governmentActions": [
    { 
      "icon": "🌳", 
      "action": "Specific city-level administrative mandate for the local municipality or CPCB.", 
      "impact": "high", 
      "category": "air", 
      "estimatedEffect": "Estimated drop in pollutants or public risk." 
    }
  ],
  "sustainabilityVision": [
    "One long-term green infrastructure or policy idea specific to this condition."
  ]
}

Format the response strictly as a JSON object matching the schema above. Do not include markdown codeblocks or extra text outside the JSON.`;

      const responseText = await generateAIInsight(prompt, { maxTokens: 800, jsonMode: true });
      
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        console.error("[AirSense] Failed to parse AI extended remedies:", responseText, e);
        throw new Error("Failed to parse AI recommendations.");
      }
    },
    enabled: enabled && !!aqi && !!city,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    retry: 1,
  });
}



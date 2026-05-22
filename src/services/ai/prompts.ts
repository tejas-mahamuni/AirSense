import { AQIData, WeatherData, ForecastItem } from '@/services/api';

export const buildAQISummaryPrompt = (aqiData: AQIData, weatherData: WeatherData, persona: string): string => {
  return `You are an expert environmental AI assistant.
Current Location: ${aqiData.city.name}
AQI: ${aqiData.aqi} (Dominant Pollutant: ${aqiData.dominantPollutant.toUpperCase()})
Temperature: ${weatherData.temp}°C
Humidity: ${weatherData.humidity}%
Wind Speed: ${weatherData.wind_speed} km/h
User Persona: ${persona}

Task: Write a very concise, human-readable summary (max 2 sentences) explaining why the AQI is at this level based on the weather conditions, and provide a single targeted health recommendation for a ${persona} user. Don't use markdown or bullet points. Just plain text.`;
};

export const buildWeatherSummaryPrompt = (weatherData: WeatherData, forecastData: ForecastItem[], city: string): string => {
  const nextDays = forecastData.filter((_, i) => i % 8 === 0).slice(0, 3);
  const tempTrend = nextDays.map(d => `${d.temp}°C`).join(', ');

  return `You are a professional meteorologist AI.
Current Location: ${city}
Current Weather: ${weatherData.temp}°C, ${weatherData.description}, Humidity: ${weatherData.humidity}%
Next 3 days temperatures: ${tempTrend}

Task: Write a very concise, professional forecast summary (max 2 sentences) describing what to expect over the next few days in human terms. Don't use markdown or bullet points. Just plain text.`;
};

export const buildDailyBriefingPrompt = (
  aqiData: AQIData, 
  weatherData: WeatherData, 
  city: string, 
  timeOfDay: 'Early Morning' | 'Morning' | 'Afternoon' | 'Evening' | 'Night'
): string => {
  return `You are a smart city AI providing a daily briefing.
Time of Day: ${timeOfDay}
City: ${city}
AQI: ${aqiData.aqi}
Temperature: ${weatherData.temp}°C
Forecast: ${weatherData.description}

Task: Write a concise, bulleted ${timeOfDay} environmental briefing (max 4 short bullet points). Focus on air quality, temperature, and one actionable tip for the rest of the day.
Format as:
• [Point 1]
• [Point 2]
• [Point 3]`;
};



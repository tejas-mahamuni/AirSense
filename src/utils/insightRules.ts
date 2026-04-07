/**
 * Smart Insight Engine - Rule Based Logic
 */

interface InsightInput {
  aqi: number;
  windSpeed: number; // km/h
  temperature: number; // Celsius
  humidity: number; // %
  dominantPollutant: string;
}

export interface SmartInsight {
  reason: string;
  recommendation: string;
  type: 'favorable' | 'unfavorable' | 'critical';
}

/**
 * Generate human-readable insights based on AQI and meteorological data.
 * Rule: High AQI + Low Wind = Pollution Stagnation
 * Rule: High Temp + NO2/O3 = Ozone Formation
 * Rule: High Humidity + PM = Particulate Swelling/Retention
 */
export function generateInsights(input: InsightInput): SmartInsight {
  const { aqi, windSpeed, temperature, humidity, dominantPollutant } = input;
  
  const insights: SmartInsight = {
    reason: "Atmospheric conditions are stable, keeping pollution levels within normal ranges for the current time of day.",
    recommendation: "Excellent day for outdoor activities. No specific precautions needed.",
    type: 'favorable'
  };

  // 1. Critical Level (Hazardous/Very Unhealthy)
  if (aqi > 200) {
    insights.reason = "Extremely high pollution concentrations detected. This is likely due to significant local emission sources paired with zero-wind stagnation.";
    insights.recommendation = "STAY INDOORS. Close all windows and use an air purifier if available. Wear an N95 mask if you MUST go out.";
    insights.type = 'critical';
    return insights;
  }

  // 2. Unfavorable Logic (Moderate to Unhealthy)
  if (aqi > 50) {
    insights.type = 'unfavorable';
    
    // Wind Rule
    if (windSpeed < 5) {
      insights.reason = "Low wind speeds are preventing the dispersion of local pollutants, leading to a build-up in your immediate area.";
    } else if (windSpeed > 25) {
      insights.reason = "High winds might be transporting dust or particles from surrounding construction or industrial zones.";
    }

    // Temperature/Ozone Rule
    if (temperature > 30 && (dominantPollutant === 'o3' || dominantPollutant === 'no2')) {
      insights.reason = "High temperatures are accelerating the chemical reactions between sunlight and vehicle emissions, increasing ground-level ozone.";
    }

    // Humidity/PM Rule
    if (humidity > 70 && dominantPollutant.includes('pm')) {
      insights.reason = "High humidity is causing particulate matter to swell and linger lower in the atmosphere, increasing your exposure.";
    }

    // Generic fallback for dominant pollutant
    if (aqi > 100 && insights.reason.includes("stable")) {
      insights.reason = `Elevated ${dominantPollutant.toUpperCase()} levels suggest significant traffic or industrial activity nearby which the atmosphere isn't fully clearing.`;
    }

    // Recommendations
    if (aqi > 150) {
      insights.recommendation = "Sensitive groups should avoid all outdoor exertion. Everyone else should significantly limit outdoor time.";
    } else if (aqi > 100) {
      insights.recommendation = "Consider wearing a mask if you have respiratory issues. Reduce prolonged or heavy outdoor exertion.";
    } else {
      insights.recommendation = "Generally safe for most, but individuals who are unusually sensitive to ozone should limit prolonged outdoor exertion.";
    }
  }

  return insights;
}

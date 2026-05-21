export interface EnvironmentalState {
  aqi: number;
  temp: number;
  condition: string;
}

export interface AnomalyResult {
  hasAnomaly: boolean;
  title?: string;
  body?: string;
  type?: 'aqi' | 'weather' | 'heat';
}

export function detectAnomalies(current: EnvironmentalState, previous: EnvironmentalState | null): AnomalyResult[] {
  const anomalies: AnomalyResult[] = [];

  // If there's no previous data to compare against, we can only check absolute critical thresholds
  if (!previous) {
    if (current.aqi > 150) {
      anomalies.push({
        hasAnomaly: true,
        type: 'aqi',
        title: '⚠️ Hazardous Air Quality',
        body: `AQI is currently ${current.aqi}. Please limit outdoor activities and wear a mask.`
      });
    }
    if (current.temp > 38) {
      anomalies.push({
        hasAnomaly: true,
        type: 'heat',
        title: '🔥 Extreme Heat Alert',
        body: `Temperature is ${current.temp}°C. Stay hydrated and avoid direct sunlight.`
      });
    }
    if ((current.condition || "").toLowerCase().includes('rain') || (current.condition || "").toLowerCase().includes('storm')) {
      anomalies.push({
        hasAnomaly: true,
        type: 'weather',
        title: '🌧️ Rain Expected',
        body: `Current conditions indicate ${current.condition}. Keep an umbrella handy!`
      });
    }
    return anomalies;
  }

  // 1. Detect Sudden AQI Spikes (Worsening Air Quality)
  const aqiSpike = current.aqi - previous.aqi;
  if (aqiSpike >= 30) {
    anomalies.push({
      hasAnomaly: true,
      type: 'aqi',
      title: '🚨 Sudden AQI Drop',
      body: `Air quality has rapidly deteriorated (AQI increased by ${aqiSpike} points). Current AQI: ${current.aqi}.`
    });
  } else if (current.aqi > 100 && previous.aqi <= 100) {
    anomalies.push({
      hasAnomaly: true,
      type: 'aqi',
      title: '⚠️ Poor Air Quality',
      body: `AQI has crossed into unhealthy levels (${current.aqi}). Sensitive groups should take precautions.`
    });
  }

  // 2. Detect Temperature Anomalies (Rapid drops or spikes)
  const tempDiff = current.temp - previous.temp;
  if (tempDiff >= 5) {
    anomalies.push({
      hasAnomaly: true,
      type: 'heat',
      title: '📈 Rapid Temperature Rise',
      body: `Temperature has spiked by ${tempDiff.toFixed(1)}°C recently. It is now ${current.temp}°C.`
    });
  } else if (tempDiff <= -5) {
    anomalies.push({
      hasAnomaly: true,
      type: 'weather',
      title: '📉 Sudden Temperature Drop',
      body: `Temperature has dropped by ${Math.abs(tempDiff).toFixed(1)}°C recently. It is now ${current.temp}°C.`
    });
  }

  // 3. Detect Weather Condition Changes (e.g., clear -> rain)
  const wasRaining = (previous.condition || "").toLowerCase().includes('rain') || (previous.condition || "").toLowerCase().includes('storm');
  const isRaining = (current.condition || "").toLowerCase().includes('rain') || (current.condition || "").toLowerCase().includes('storm');
  
  if (!wasRaining && isRaining) {
    anomalies.push({
      hasAnomaly: true,
      type: 'weather',
      title: '🌧️ Rain Alert',
      body: `Conditions have changed to ${current.condition}. Precipitation is likely.`
    });
  }

  return anomalies;
}

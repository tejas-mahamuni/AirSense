/**
 * Climate Risk Scoring Utility
 */

export interface ClimateRiskData {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Severe';
  color: string;
}

export function calculateClimateRisk(
  aqi: number,
  heatIndex: number,
  humidity: number,
  windSpeed: number
): ClimateRiskData {
  // Score components (weighted)
  const aqiWeight = 0.35;
  const heatWeight = 0.40;
  const humidityWeight = 0.15;
  const windWeight = 0.10;

  // Normalize inputs (0-100 scales)
  const normAqi = Math.min(100, (aqi / 300) * 100);
  const normHeat = Math.min(100, (Math.max(0, heatIndex - 20) / 30) * 100);
  const normHumidity = Math.min(100, (Math.abs(humidity - 50) / 50) * 100); // Deviation from comfortable 50%
  const normWind = windSpeed < 5 ? 80 : windSpeed < 15 ? 30 : 0; // Low wind = higher risk for pollution/heat trapping

  const score = Math.round(
    normAqi * aqiWeight +
    normHeat * heatWeight +
    normHumidity * humidityWeight +
    normWind * windWeight
  );

  let level: ClimateRiskData['level'] = 'Low';
  let color = '#34C759';

  if (score > 75) {
    level = 'Severe';
    color = '#FF453A';
  } else if (score > 50) {
    level = 'High';
    color = '#FF9F0A';
  } else if (score > 25) {
    level = 'Moderate';
    color = '#FFD60A';
  }

  return { score, level, color };
}

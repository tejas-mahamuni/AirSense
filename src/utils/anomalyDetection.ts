/**
 * Anomaly Detection Utility
 */

export interface AnomalyData {
  value: number;
  average: number;
  departure: number;
  status: 'normal' | 'low' | 'high' | 'extreme';
  isPositive: boolean;
}

export function detectTemperatureAnomaly(actual: number): AnomalyData {
  // Baseline average for the current season (mocking for demonstration)
  const average = 32; 
  const departure = actual - average;
  
  let status: AnomalyData['status'] = 'normal';
  if (Math.abs(departure) > 8) status = 'extreme';
  else if (Math.abs(departure) > 4) status = 'high';
  else if (Math.abs(departure) > 2) status = 'low';

  return {
    value: actual,
    average,
    departure: parseFloat(departure.toFixed(2)),
    status,
    isPositive: departure > 0
  };
}

export function detectHumidityTrend(current: number, past: number): 'rising' | 'falling' | 'stable' {
  const diff = current - past;
  if (Math.abs(diff) < 2) return 'stable';
  return diff > 0 ? 'rising' : 'falling';
}

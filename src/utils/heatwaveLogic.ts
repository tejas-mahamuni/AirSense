/**
 * Heatwave Logic Engine
 * Calculates heat index and determines heatwave severity
 */

export type HeatwaveSeverity = 'normal' | 'warm' | 'heatwave' | 'severe-heatwave';

export interface HeatwaveAnalysis {
  heatIndex: number;
  feelsLike: number;
  severity: HeatwaveSeverity;
  severityLabel: string;
  severityColor: string;
  severeAlert: boolean;
  citizenAdvisory: string[];
  outdoorSafety: string[];
  governmentActions: string[];
}

/**
 * Rothfusz Heat Index formula (NWS standard)
 * Valid for temp > 27°C and humidity > 40%
 */
export function calculateHeatIndex(tempC: number, humidity: number): number {
  const tempF = tempC * 9 / 5 + 32;
  const rh = humidity;

  if (tempF < 80) {
    // Use simple formula for lower temperatures
    const hif = 0.5 * (tempF + 61 + ((tempF - 68) * 1.2) + (rh * 0.094));
    return parseFloat((((hif - 32) * 5) / 9).toFixed(1));
  }

  // Full Rothfusz regression
  let hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * rh -
    0.22475541 * tempF * rh -
    0.00683783 * tempF * tempF -
    0.05481717 * rh * rh +
    0.00122874 * tempF * tempF * rh +
    0.00085282 * tempF * rh * rh -
    0.00000199 * tempF * tempF * rh * rh;

  // Adjustments
  if (rh < 13 && tempF >= 80 && tempF <= 112) {
    hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
  } else if (rh > 85 && tempF >= 80 && tempF <= 87) {
    hi += ((rh - 85) / 10) * ((87 - tempF) / 5);
  }

  // Convert back to Celsius — round to 1 decimal
  return parseFloat((((hi - 32) * 5) / 9).toFixed(1));
}

/**
 * Simplified feels-like temperature (wind chill + heat index blend)
 */
export function calculateFeelsLike(tempC: number, humidity: number): number {
  return calculateHeatIndex(tempC, humidity);
}

export function getHeatwaveSeverity(heatIndex: number): HeatwaveSeverity {
  if (heatIndex >= 54) return 'severe-heatwave';
  if (heatIndex >= 41) return 'heatwave';
  if (heatIndex >= 32) return 'warm';
  return 'normal';
}

export function analyzeHeatwave(tempC: number, humidity: number): HeatwaveAnalysis {
  const heatIndex = calculateHeatIndex(tempC, humidity);
  const feelsLike = calculateFeelsLike(tempC, humidity);
  const severity = getHeatwaveSeverity(heatIndex);

  const severityMap: Record<HeatwaveSeverity, { label: string; color: string }> = {
    'normal': { label: 'Normal', color: '#34C759' },
    'warm': { label: 'Warm', color: '#FFD60A' },
    'heatwave': { label: 'Heatwave', color: '#FF9F0A' },
    'severe-heatwave': { label: 'Severe Heatwave 🚨', color: '#FF453A' },
  };

  const citizenAdvisory: string[] = [];
  const outdoorSafety: string[] = [];
  const governmentActions: string[] = [];

  if (severity === 'normal') {
    citizenAdvisory.push('Conditions are comfortable.', 'Stay hydrated as usual.');
    outdoorSafety.push('All outdoor activities are safe.');
    governmentActions.push('Maintain standard public health monitoring.');
  } else if (severity === 'warm') {
    citizenAdvisory.push(
      'Drink 2–3 litres of water throughout the day.',
      'Wear light, breathable clothing.',
      'Limit heavy outdoor exertion during peak hours (11AM–4PM).'
    );
    outdoorSafety.push(
      'Take breaks in shaded areas every 30 minutes.',
      'Do not leave children or pets in parked vehicles.'
    );
    governmentActions.push(
      'Monitor vulnerable populations (elderly, children).',
      'Ensure water fountains in public areas are functional.'
    );
  } else if (severity === 'heatwave') {
    citizenAdvisory.push(
      'Avoid outdoor exposure from 12PM–4PM.',
      'Drink ORS (Oral Rehydration Salts) to stay hydrated.',
      'Wear white or light-colored loose cotton clothes.',
      'Use cooling towels on neck and wrists.',
      'Check on elderly neighbors and relatives.'
    );
    outdoorSafety.push(
      'Carry water at all times.',
      'Seek air-conditioned or shaded environments.',
      'Postpone strenuous outdoor activities.'
    );
    governmentActions.push(
      'Open public cooling centers across the city.',
      'Install temporary water stations in public areas.',
      'Issue public heatwave health alerts via SMS/media.',
      'Increase urban tree cover in heat island zones.'
    );
  } else {
    // severe-heatwave
    citizenAdvisory.push(
      '🚨 EMERGENCY: Avoid all outdoor activity.',
      'Drink ORS every 30 minutes — do not wait for thirst.',
      'Stay in air-conditioned rooms; use wet towels on body.',
      'Wear minimal, loose white cotton clothing.',
      'Call emergency services if experiencing heat stroke symptoms (confusion, no sweating, high temperature).'
    );
    outdoorSafety.push(
      'Do NOT go outdoors unless absolutely necessary.',
      'If outdoors: carry umbrella, water, wear a hat.',
      'Watch for heat stroke: hot/dry skin, rapid pulse, confusion.'
    );
    governmentActions.push(
      '🚨 Declare heat emergency and activate crisis protocols.',
      'Open all available cooling centers and shelters.',
      'Deploy mobile water tankers to residential areas.',
      'Suspend outdoor construction and physical labor.',
      'Issue mandatory heat alerts via all emergency channels.',
      'Increase green cover and reflective roofing programs immediately.'
    );
  }

  return {
    heatIndex,
    feelsLike,
    severity,
    severityLabel: severityMap[severity].label,
    severityColor: severityMap[severity].color,
    severeAlert: severity === 'severe-heatwave',
    citizenAdvisory,
    outdoorSafety,
    governmentActions,
  };
}

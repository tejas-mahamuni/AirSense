/**
 * Pollution Impact Engine
 * Analyzes pollution sources, contributions, and improvement potential
 */

export interface PollutantContribution {
  name: string;
  value: number;
  unit: string;
  percentage: number;
  primarySource: string;
  color: string;
}

export interface AreaImprovementFactor {
  problem: string;
  icon: string;
  action: string;
  potentialAQIReduction: number; // percentage
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface ImprovementScoreResult {
  currentAQI: number;
  sustainabilityScore: number; // 0-100
  potentialImprovement: number; // percentage
  factors: AreaImprovementFactor[];
  dominantProblems: string[];
  estimatedTargetAQI: number;
}

export function analyzePollutantContributions(
  pollutants: Record<string, { v: number }> | undefined,
  aqi: number
): PollutantContribution[] {
  if (!pollutants) return [];

  const contributions: PollutantContribution[] = [];
  const total = Object.values(pollutants).reduce((acc, p) => acc + (p?.v || 0), 0) || 1;

  const colorMap: Record<string, string> = {
    pm25: '#FF453A',
    pm10: '#FF9F0A',
    no2: '#BF5AF2',
    o3: '#30D158',
    co: '#FFD60A',
    so2: '#64D2FF',
  };

  const sourceMap: Record<string, string> = {
    pm25: 'Vehicle exhaust, construction dust, industrial emissions',
    pm10: 'Road dust, construction, agricultural burning',
    no2: 'Vehicle engines, power plants, industrial combustion',
    o3: 'Sunlight + vehicle/industrial VOC reactions',
    co: 'Incomplete combustion, vehicle exhaust',
    so2: 'Coal burning, industrial processes, power plants',
  };

  const labelMap: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    o3: 'O₃ Ozone',
    co: 'CO',
    so2: 'SO₂',
  };

  for (const [key, val] of Object.entries(pollutants)) {
    if (!val?.v) continue;
    contributions.push({
      name: labelMap[key] || key.toUpperCase(),
      value: Math.round(val.v * 10) / 10,
      unit: key === 'co' ? 'mg/m³' : 'μg/m³',
      percentage: Math.round((val.v / total) * 100),
      primarySource: sourceMap[key] || 'Multiple sources',
      color: colorMap[key] || '#6b7280',
    });
  }

  return contributions.sort((a, b) => b.percentage - a.percentage);
}

export function calculateImprovementScore(
  aqi: number,
  pollutants: Record<string, { v: number }> | undefined,
  windSpeed: number,
  temp: number,
  humidity: number
): ImprovementScoreResult {
  const factors: AreaImprovementFactor[] = [];
  const dominantProblems: string[] = [];
  let totalReductionPotential = 0;

  const pm25 = pollutants?.pm25?.v || 0;
  const pm10 = pollutants?.pm10?.v || 0;
  const no2 = pollutants?.no2?.v || 0;
  const o3 = pollutants?.o3?.v || 0;

  // Traffic pollution (NO2/PM)
  if (no2 > 40 || (pm25 > 30 && pm10 > 50)) {
    dominantProblems.push('Traffic Congestion');
    const reduction = Math.min(25, Math.round((no2 / 100) * 25));
    totalReductionPotential += reduction;
    factors.push({
      problem: 'Traffic Congestion & Vehicle Emissions',
      icon: '🚗',
      action: 'Promote public transport, EV adoption & traffic management',
      potentialAQIReduction: reduction,
      priority: no2 > 60 ? 'high' : 'medium',
      timeframe: '6–12 months',
    });
  }

  // Construction dust (PM10)
  if (pm10 > 70) {
    dominantProblems.push('Construction Dust');
    const reduction = Math.min(15, Math.round((pm10 / 150) * 15));
    totalReductionPotential += reduction;
    factors.push({
      problem: 'Construction & Road Dust',
      icon: '🏗️',
      action: 'Water sprinkling, dust barriers & construction regulation',
      potentialAQIReduction: reduction,
      priority: 'high',
      timeframe: '1–3 months',
    });
  }

  // Heat island / poor ventilation
  if (temp > 35 && windSpeed < 5) {
    dominantProblems.push('Heat Island Effect');
    totalReductionPotential += 10;
    factors.push({
      problem: 'Heat Island & Poor Ventilation',
      icon: '🌡️',
      action: 'Urban tree plantation, reflective surfaces & green corridors',
      potentialAQIReduction: 10,
      priority: 'medium',
      timeframe: '12–24 months',
    });
  }

  // Ozone (photochemical)
  if (o3 > 80) {
    dominantProblems.push('Ground-level Ozone');
    const reduction = Math.min(12, Math.round((o3 / 200) * 12));
    totalReductionPotential += reduction;
    factors.push({
      problem: 'Photochemical Ozone Formation',
      icon: '☀️',
      action: 'Reduce VOC emissions from industries & vehicles',
      potentialAQIReduction: reduction,
      priority: 'medium',
      timeframe: '3–6 months',
    });
  }

  // Low wind stagnation
  if (windSpeed < 3 && aqi > 100) {
    dominantProblems.push('Poor Air Circulation');
    totalReductionPotential += 8;
    factors.push({
      problem: 'Atmospheric Stagnation (Low Wind)',
      icon: '💨',
      action: 'Increase green corridors for natural wind channels',
      potentialAQIReduction: 8,
      priority: 'low',
      timeframe: 'Long-term (3–5 years)',
    });
  }

  // Always add baseline factor
  factors.push({
    problem: 'Industrial & Residential Burning',
    icon: '🏭',
    action: 'Enforce emission caps & switch to clean energy',
    potentialAQIReduction: 15,
    priority: 'high',
    timeframe: '2–5 years',
  });
  totalReductionPotential += 15;

  const potentialImprovement = Math.min(totalReductionPotential, 60);
  const estimatedTargetAQI = Math.max(20, Math.round(aqi * (1 - potentialImprovement / 100)));
  const sustainabilityScore = Math.round(100 - (aqi / 500) * 100);

  return {
    currentAQI: aqi,
    sustainabilityScore: Math.max(5, sustainabilityScore),
    potentialImprovement,
    factors,
    dominantProblems,
    estimatedTargetAQI,
  };
}

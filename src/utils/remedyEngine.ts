/**
 * Environmental Remedy Engine
 * Generates citizen precautions, government actions, and sustainability suggestions
 * based on AQI, pollutants, weather, and heat index.
 */

import { analyzeHeatwave } from './heatwaveLogic';

export interface PrecautionItem {
  icon: string;
  text: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface GovernmentAction {
  icon: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
  category: 'air' | 'heat' | 'dust' | 'traffic' | 'infrastructure';
  estimatedEffect: string;
}

export interface RemedyActions {
  citizen: PrecautionItem[];
  government: GovernmentAction[];
  sustainability: string[];
  improvementScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskLabel: string;
  riskColor: string;
  detectedRisks: string[];
  heatwaveStatus: string;
}

export function generateRemedies(
  aqi: number,
  pollutants: Record<string, { v: number }> | undefined,
  temp?: number,
  humidity?: number,
  windSpeed?: number
): RemedyActions {
  const citizen: PrecautionItem[] = [];
  const government: GovernmentAction[] = [];
  const sustainability: string[] = [];
  const detectedRisks: string[] = [];
  let improvementScore = 0;
  let riskLevel: RemedyActions['riskLevel'] = 'low';
  let riskLabel = 'Low Risk';
  let riskColor = '#34C759';

  const pm25 = pollutants?.pm25?.v || 0;
  const no2 = pollutants?.no2?.v || 0;
  const o3 = pollutants?.o3?.v || 0;
  const pm10 = pollutants?.pm10?.v || 0;

  // Heatwave analysis
  const heatwave = temp !== undefined && humidity !== undefined
    ? analyzeHeatwave(temp, humidity)
    : null;

  const heatwaveStatus = heatwave?.severityLabel || 'Normal';

  // ─── AQI-based base rules ────────────────────────────────────────────────
  if (aqi <= 50) {
    riskLevel = 'low'; riskLabel = 'Low Risk'; riskColor = '#34C759';
    improvementScore = 95;
    citizen.push(
      { icon: '🌿', text: 'Enjoy outdoor activities freely.', priority: 'low' },
      { icon: '🪟', text: 'Open windows for fresh ventilation.', priority: 'low' }
    );
    government.push(
      { icon: '🌳', action: 'Maintain current green initiatives and tree cover.', impact: 'medium', category: 'infrastructure', estimatedEffect: 'Sustains AQI below 50' },
      { icon: '📊', action: 'Continue continuous emissions monitoring.', impact: 'low', category: 'air', estimatedEffect: 'Prevents future degradation' }
    );
    sustainability.push('Promote cycling and walking over driving.', 'Support local organic farming.');
  } else if (aqi <= 100) {
    riskLevel = 'moderate'; riskLabel = 'Moderate Risk'; riskColor = '#FFD60A';
    improvementScore = 78;
    citizen.push(
      { icon: '😷', text: 'Sensitive individuals should limit prolonged outdoor exertion.', priority: 'medium' },
      { icon: '🪟', text: 'Keep windows open during mid-day for ventilation.', priority: 'low' },
      { icon: '💧', text: 'Stay hydrated — drink at least 2L of water daily.', priority: 'medium' }
    );
    government.push(
      { icon: '🚛', action: 'Increase road sweeping and dust suppression frequency.', impact: 'medium', category: 'dust', estimatedEffect: 'Reduces PM10 by 10–15%' },
      { icon: '🏭', action: 'Monitor industrial emissions closely in nearby zones.', impact: 'high', category: 'air', estimatedEffect: 'Prevents escalation to AQI 150+' }
    );
    sustainability.push('Plant more urban trees and green belts.', 'Encourage carpooling programs.');
  } else if (aqi <= 150) {
    riskLevel = 'high'; riskLabel = 'High Risk'; riskColor = '#FF9F0A';
    improvementScore = 52;
    detectedRisks.push('High Particulate Exposure');
    citizen.push(
      { icon: '😷', text: 'Wear N95 mask if going outdoors.', priority: 'high' },
      { icon: '🏃', text: 'Avoid strenuous outdoor exercise.', priority: 'high' },
      { icon: '🌬️', text: 'Use air purifiers indoors if available.', priority: 'medium' },
      { icon: '💧', text: 'Drink water frequently — avoid dehydration.', priority: 'medium' }
    );
    government.push(
      { icon: '🚗', action: 'Control traffic emissions in dense urban areas.', impact: 'high', category: 'traffic', estimatedEffect: 'AQI reduction of 15–20%' },
      { icon: '💦', action: 'Increase water sprinkling on roads and construction sites.', impact: 'high', category: 'dust', estimatedEffect: 'Reduces PM10 by 20–25%' },
      { icon: '🏗️', action: 'Restrict non-essential construction dust activities.', impact: 'medium', category: 'dust', estimatedEffect: 'Reduces PM2.5 by 10%' }
    );
    sustainability.push('Transition to electric public transport.', 'Implement strict industrial emission caps.');
  } else if (aqi <= 200) {
    riskLevel = 'critical'; riskLabel = 'Critical Risk'; riskColor = '#FF453A';
    improvementScore = 30;
    detectedRisks.push('Unhealthy Air Quality', 'High PM2.5 Exposure Risk');
    citizen.push(
      { icon: '🏠', text: 'Stay indoors — keep all windows and doors closed.', priority: 'critical' },
      { icon: '😷', text: 'If outdoors is unavoidable, wear N95/N99 mask.', priority: 'critical' },
      { icon: '🌬️', text: 'Use HEPA air purifiers continuously.', priority: 'high' },
      { icon: '🏃', text: 'Avoid ALL outdoor exercise.', priority: 'critical' },
      { icon: '👴', text: 'Elderly and children should not go outside.', priority: 'critical' }
    );
    government.push(
      { icon: '🌀', action: 'Install roadside air purifiers at high-traffic zones.', impact: 'high', category: 'air', estimatedEffect: 'Local AQI reduction of 20–30%' },
      { icon: '🚦', action: 'Implement odd-even vehicle rule on major roads.', impact: 'high', category: 'traffic', estimatedEffect: 'Reduces vehicular emissions by 30%' },
      { icon: '🏗️', action: 'Halt all construction activities in the city.', impact: 'high', category: 'dust', estimatedEffect: 'Reduces PM10 by 25–35%' },
      { icon: '📢', action: 'Issue public health alerts via all media channels.', impact: 'medium', category: 'infrastructure', estimatedEffect: 'Reduces public exposure risk' },
      { icon: '🌳', action: 'Deploy anti-smog guns and increase urban greenery.', impact: 'medium', category: 'air', estimatedEffect: 'Reduces PM2.5 by 15%' }
    );
    sustainability.push('Establish large-scale urban forests.', 'Ban high-emission industries near city limits.', 'Invest in renewable energy infrastructure.');
  } else {
    riskLevel = 'critical'; riskLabel = 'Hazardous 🚨'; riskColor = '#FF2D55';
    improvementScore = 12;
    detectedRisks.push('Hazardous Air Quality', 'Extreme Health Emergency', 'Severe PM2.5/PM10 Overload');
    citizen.push(
      { icon: '🚨', text: 'HEALTH EMERGENCY — Do NOT leave home without N99 mask.', priority: 'critical' },
      { icon: '🪟', text: 'Seal all windows and doors with wet cloth if no AC.', priority: 'critical' },
      { icon: '🌬️', text: 'Run HEPA air purifiers at maximum setting.', priority: 'critical' },
      { icon: '🏥', text: 'Seek medical attention if experiencing chest pain or breathing difficulty.', priority: 'critical' },
      { icon: '📱', text: 'Monitor emergency health alerts continuously.', priority: 'high' }
    );
    government.push(
      { icon: '🚨', action: 'Declare public health emergency.', impact: 'high', category: 'infrastructure', estimatedEffect: 'Activates crisis response systems' },
      { icon: '🏭', action: 'Shut down non-essential industries immediately.', impact: 'high', category: 'air', estimatedEffect: 'AQI reduction of 35–50%' },
      { icon: '🚗', action: 'Deploy emergency vehicle restrictions citywide.', impact: 'high', category: 'traffic', estimatedEffect: 'Reduces vehicular emissions by 50%' },
      { icon: '😷', action: 'Distribute free N95/N99 masks to citizens.', impact: 'high', category: 'infrastructure', estimatedEffect: 'Reduces health risk exposure' },
      { icon: '🌀', action: 'Deploy mobile air filtration units in critical zones.', impact: 'high', category: 'air', estimatedEffect: 'Local AQI improvement of 25%' }
    );
    sustainability.push('Overhaul city energy grid to 100% renewables.', 'Relocate polluting industrial infrastructure.', 'Implement emergency urban afforestation program.');
  }

  // ─── Pollutant-specific additions ────────────────────────────────────────
  if (pm25 > 50) {
    detectedRisks.push('High PM2.5');
    citizen.push({ icon: '😷', text: 'PM2.5 is very high — wear a high-quality N95 mask always outdoors.', priority: 'high' });
    government.push({ icon: '💦', action: 'Deploy anti-smog guns to settle PM2.5 particles in hotspots.', impact: 'high', category: 'air', estimatedEffect: 'Reduces PM2.5 by 20–30%' });
  }

  if (no2 > 60) {
    detectedRisks.push('High NO₂ (Traffic Emissions)');
    citizen.push({ icon: '🚶', text: 'Avoid walking near heavy traffic roads.', priority: 'medium' });
    government.push({ icon: '🚌', action: 'Restrict heavy diesel vehicles from entering city core.', impact: 'high', category: 'traffic', estimatedEffect: 'Reduces NO₂ by 25%' });
  }

  if (o3 > 100) {
    detectedRisks.push('Elevated Ozone');
    citizen.push({ icon: '⏰', text: 'Ozone peaks in afternoon — avoid outdoor activity from 12PM–6PM.', priority: 'medium' });
    government.push({ icon: '🏭', action: 'Limit VOC emissions from factories during peak sunlight hours.', impact: 'medium', category: 'air', estimatedEffect: 'Reduces O₃ formation by 15%' });
  }

  if (pm10 > 100) {
    detectedRisks.push('Dust Pollution');
    citizen.push({ icon: '🧣', text: 'Dust levels high — cover nose and mouth when outdoors.', priority: 'high' });
    government.push({ icon: '🚿', action: 'Enforce mandatory dust barriers at construction sites.', impact: 'high', category: 'dust', estimatedEffect: 'Reduces PM10 by 30%' });
  }

  if (windSpeed !== undefined && windSpeed < 3 && aqi > 80) {
    detectedRisks.push('Air Stagnation (No Wind)');
    citizen.push({ icon: '⚠️', text: 'Very low wind — pollution is trapped. Stay indoors as much as possible.', priority: 'high' });
  }

  // ─── Heatwave additions ───────────────────────────────────────────────────
  if (heatwave && heatwave.severity !== 'normal') {
    detectedRisks.push(`${heatwave.severityLabel} Detected`);
    heatwave.citizenAdvisory.forEach(a =>
      citizen.push({ icon: '🌡️', text: a, priority: heatwave.severeAlert ? 'critical' : 'high' })
    );
    heatwave.governmentActions.forEach(a =>
      government.push({ icon: '🏛️', action: a, impact: 'high', category: 'heat', estimatedEffect: 'Reduces heat-related illness risk' })
    );
  }

  // Remove duplicates
  const seen = new Set<string>();
  const uniqueCitizen = citizen.filter(c => !seen.has(c.text) && seen.add(c.text));
  const seenGov = new Set<string>();
  const uniqueGov = government.filter(g => !seenGov.has(g.action) && seenGov.add(g.action));

  return {
    citizen: uniqueCitizen,
    government: uniqueGov,
    sustainability,
    improvementScore,
    riskLevel,
    riskLabel,
    riskColor,
    detectedRisks,
    heatwaveStatus,
  };
}

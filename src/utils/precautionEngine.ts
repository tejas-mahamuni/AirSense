/**
 * Precaution Generation Engine - AirSense Special
 */

export interface Precaution {
  icon: string;
  text: string;
  category: 'heat' | 'air' | 'humidity' | 'wind' | 'general';
  priority: 'low' | 'medium' | 'high' | 'severe';
  severityColor: string;
}

export function generateClimatePrecautions(
  temp: number,
  humidity: number,
  heatIndex: number,
  aqi: number,
  windSpeed: number
): Precaution[] {
  const list: Precaution[] = [];

  // 🌡️ TEMPERATURE-BASED PRECAUTIONS
  if (temp > 42) {
    list.push(
      { icon: 'emergency_home', text: 'Severe heatwave emergency: Stay indoors if possible', category: 'heat', priority: 'severe', severityColor: '#FF453A' },
      { icon: 'water_bottle', text: 'Drink ORS regularly to prevent severe dehydration', category: 'heat', priority: 'severe', severityColor: '#FF453A' },
      { icon: 'fitness_center', text: 'Avoid heavy physical activity or exercise', category: 'heat', priority: 'severe', severityColor: '#FF453A' },
      { icon: 'family_restroom', text: 'Elderly & children should avoid any outdoor exposure', category: 'heat', priority: 'severe', severityColor: '#FF453A' }
    );
  } else if (temp > 38) {
    list.push(
      { icon: 'warning', text: 'Heatwave warning: Avoid going outside from 12PM–4PM', category: 'heat', priority: 'high', severityColor: '#FF9F0A' },
      { icon: 'wb_shade', text: 'Stay in cool or shaded areas during peak sun', category: 'heat', priority: 'high', severityColor: '#FF9F0A' },
      { icon: 'medical_services', text: 'Monitor closely for dehydration or dizziness symptoms', category: 'heat', priority: 'high', severityColor: '#FF9F0A' }
    );
  } else if (temp > 32) {
    list.push(
      { icon: 'sunny', text: 'Avoid direct sun exposure and seek shade', category: 'heat', priority: 'medium', severityColor: '#FFD60A' },
      { icon: 'water_drop', text: 'Drink plenty of water even if not thirsty', category: 'heat', priority: 'medium', severityColor: '#FFD60A' },
      { icon: 'vaccines', text: 'Carry ORS while traveling or working outdoors', category: 'heat', priority: 'medium', severityColor: '#FFD60A' },
      { icon: 'checkroom', text: 'Wear light cotton clothes for better breathability', category: 'heat', priority: 'medium', severityColor: '#FFD60A' }
    );
  }

  // 💧 HUMIDITY-BASED PRECAUTIONS
  if (humidity > 70) {
    list.push(
      { icon: 'humidity_percentage', text: 'High humidity may increase discomfort and heat stress', category: 'humidity', priority: 'medium', severityColor: '#007AFF' },
      { icon: 'air', text: 'Stay in well-ventilated areas to assist cooling', category: 'humidity', priority: 'medium', severityColor: '#007AFF' }
    );
  }

  // 🌫️ AQI-BASED PRECAUTIONS
  if (aqi > 250) {
    list.push(
      { icon: 'no_transportation', text: 'Avoid unnecessary travel due to hazardous air', category: 'air', priority: 'severe', severityColor: '#FF453A' },
      { icon: 'elderly', text: 'Sensitive groups should stay strictly indoors', category: 'air', priority: 'severe', severityColor: '#FF453A' },
      { icon: 'directions_run', text: 'Reduce or stop all outdoor exercise', category: 'air', priority: 'severe', severityColor: '#FF453A' }
    );
  } else if (aqi > 150) {
    list.push(
      { icon: 'mask', text: 'Wear N95 mask for any outdoor movement', category: 'air', priority: 'high', severityColor: '#FF9F0A' },
      { icon: 'self_care', text: 'Avoid jogging/running outside; prefer indoor exercise', category: 'air', priority: 'high', severityColor: '#FF9F0A' },
      { icon: 'window', text: 'Keep windows closed to prevent pollutant entry', category: 'air', priority: 'high', severityColor: '#FF9F0A' }
    );
  }

  // 🌬️ WIND-BASED INSIGHTS
  if (windSpeed < 5) {
    list.push(
      { icon: 'cyclone', text: 'Low wind may trap pollutants; air dispersion is poor', category: 'wind', priority: 'low', severityColor: '#8E8E93' }
    );
  }

  return list;
}

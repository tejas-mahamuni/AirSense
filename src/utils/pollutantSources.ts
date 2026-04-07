export interface PollutantInfo {
  name: string;
  fullName: string;
  unit: string;
  safeLimit: number;
  source: string;
}

export const pollutantData: Record<string, PollutantInfo> = {
  pm25: { name: 'PM2.5', fullName: 'Fine Particulate Matter', unit: 'μg/m³', safeLimit: 25, source: 'Vehicle exhaust, industrial burning, cooking' },
  pm10: { name: 'PM10', fullName: 'Coarse Particulate Matter', unit: 'μg/m³', safeLimit: 50, source: 'Construction dust, road dust, pollen' },
  no2: { name: 'NO₂', fullName: 'Nitrogen Dioxide', unit: 'ppb', safeLimit: 40, source: 'Vehicle engines, power plants' },
  o3: { name: 'O₃', fullName: 'Ozone', unit: 'ppb', safeLimit: 60, source: 'Sunlight + NOx + VOCs reaction' },
  co: { name: 'CO', fullName: 'Carbon Monoxide', unit: 'ppm', safeLimit: 9, source: 'Incomplete fuel combustion' },
  so2: { name: 'SO₂', fullName: 'Sulfur Dioxide', unit: 'ppb', safeLimit: 20, source: 'Coal burning, industrial smelting' },
};

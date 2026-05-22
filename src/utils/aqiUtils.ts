/**
 * AQI Calculation and Status Helpers
 */

/**
 * Calculate AQI from PM2.5 concentration using EPA breakpoints.
 * Formula: AQI = ((Ihi - Ilo) / (BPhi - BPlo)) * (Cp - BPlo) + Ilo
 */
export function calculateAQIFromPM(pm25: number): number {
  if (typeof pm25 !== 'number' || pm25 < 0) return 0;
  
  const breakpoints = [
    { bpLo: 0.0, bpHi: 12.0, iLo: 0, iHi: 50 },
    { bpLo: 12.1, bpHi: 35.4, iLo: 51, iHi: 100 },
    { bpLo: 35.5, bpHi: 55.4, iLo: 101, iHi: 150 },
    { bpLo: 55.5, bpHi: 150.4, iLo: 151, iHi: 200 },
    { bpLo: 150.5, bpHi: 250.4, iLo: 201, iHi: 300 },
    { bpLo: 250.5, bpHi: 350.4, iLo: 301, iHi: 400 },
    { bpLo: 350.5, bpHi: 500.4, iLo: 401, iHi: 500 },
  ];

  const range = breakpoints.find(b => pm25 <= b.bpHi) || breakpoints[breakpoints.length - 1];
  
  return Math.round(
    ((range.iHi - range.iLo) / (range.bpHi - range.bpLo)) * (pm25 - range.bpLo) + range.iLo
  );
}

/**
 * Calculate AQI from PM2.5 and PM10 concentrations using Indian National AQI (CPCB) breakpoints.
 */
export function calculateIndianAQI(pm25: number, pm10: number = 0): number {
  if (typeof pm25 !== 'number' || pm25 < 0) pm25 = 0;
  if (typeof pm10 !== 'number' || pm10 < 0) pm10 = 0;

  const getSubIndexPM25 = (val: number): number => {
    if (val <= 0) return 0;
    if (val <= 30) return (50 / 30) * val;
    if (val <= 60) return 50 + ((100 - 50) / (60 - 30)) * (val - 30);
    if (val <= 90) return 100 + ((200 - 100) / (90 - 60)) * (val - 60);
    if (val <= 120) return 200 + ((300 - 200) / (120 - 90)) * (val - 90);
    if (val <= 250) return 300 + ((400 - 300) / (250 - 120)) * (val - 120);
    return 400 + ((500 - 400) / (500 - 250)) * (val - 250);
  };

  const getSubIndexPM10 = (val: number): number => {
    if (val <= 0) return 0;
    if (val <= 50) return (50 / 50) * val;
    if (val <= 100) return 50 + ((100 - 50) / (100 - 50)) * (val - 50);
    if (val <= 250) return 100 + ((200 - 100) / (250 - 100)) * (val - 100);
    if (val <= 350) return 200 + ((300 - 200) / (350 - 250)) * (val - 250);
    if (val <= 430) return 300 + ((400 - 300) / (430 - 350)) * (val - 350);
    return 400 + ((500 - 400) / (500 - 430)) * (val - 430);
  };

  const aqi25 = getSubIndexPM25(pm25);
  const aqi10 = getSubIndexPM10(pm10);
  
  return Math.round(Math.max(aqi25, aqi10));
}


export type AQIStatus = 'Live' | 'Outdated' | 'No Data' | 'Estimated';

/**
 * Determine the status of a station based on its last updated time.
 */
export function getStationStatus(timeStr: any, hasAQI: boolean): AQIStatus {
  if (!hasAQI || !timeStr) return 'No Data';

  let stationTime = 0;
  try {
    if (typeof timeStr === 'string') {
      stationTime = new Date(timeStr.replace(' ', 'T')).getTime();
    } else {
      stationTime = new Date(timeStr).getTime();
    }
  } catch (e) {
    stationTime = 0;
  }
  
  if (!stationTime || isNaN(stationTime)) return 'No Data';

  const now = Date.now();
  const diffHours = (now - stationTime) / (1000 * 60 * 60);
  
  if (diffHours < 24) return 'Live';
  return 'Outdated';
}

/**
 * Get color and label for status badges.
 */
export function getStatusTheme(status: AQIStatus) {
  switch (status) {
    case 'Live':
      return { color: '#10b981', label: 'Live', icon: '🟢' };
    case 'Outdated':
      return { color: '#f59e0b', label: 'Outdated', icon: '🟡' };
    case 'No Data':
      return { color: '#ef4444', label: 'No Data', icon: '🔴' };
    case 'Estimated':
      return { color: '#6366f1', label: 'Estimated', icon: '🔵' };
    default:
      return { color: '#6b7280', label: 'Unknown', icon: '⚪' };
  }
}

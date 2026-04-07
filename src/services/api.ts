import { calculateAQIFromPM, getStationStatus, AQIStatus } from '@/utils/aqiUtils';

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;
const OWM_KEY = import.meta.env.VITE_OWM_KEY;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AQIData {
  aqi: number;
  station: string;
  dominantPollutant: string;
  time: string;
  iaqi: Record<string, { v: number }>;
  city: { name: string; geo: [number, number] };
  status: AQIStatus;
  source: 'WAQI' | 'OpenWeather';
  lastUpdated: string;
  forecast?: {
    daily?: Record<string, Array<{ avg: number; day: string; max: number; min: number }>>;
  };
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
  dt: number;
  sunrise: number;
  sunset: number;
  dew_point: number;
  uv_index?: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  icon: string;
  description: string;
  pop: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
}

export interface NearbyStation {
  uid: number;
  aqi: string;
  lat: number;
  lon: number;
  station: { name: string; time: string };
  status?: AQIStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

/**
 * Normalizes raw WAQI data.
 */
function normalizeWAQI(raw: any): AQIData {
  if (!raw) throw new Error("Null AQI data received");
  
  let rawTime = raw.time?.iso || raw.time?.s || '';
  if (rawTime && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(rawTime)) {
    rawTime = rawTime.replace(' ', 'T');
  }
  
  const status = getStationStatus(rawTime, raw.aqi !== undefined && raw.aqi !== '-');

  return {
    aqi: typeof raw.aqi === 'number' ? raw.aqi : parseInt(raw.aqi) || 0,
    station: raw.city?.name || raw.station?.name || 'Unknown Station',
    dominantPollutant: raw.dominentpol || raw.dominantPollutant || 'pm25',
    time: rawTime || new Date().toISOString(),
    iaqi: raw.iaqi || {},
    city: {
      name: raw.city?.name || 'Unknown',
      geo: raw.city?.geo || [0, 0],
    },
    status: status,
    source: 'WAQI',
    lastUpdated: rawTime || new Date().toISOString(),
    forecast: raw.forecast || undefined,
  };
}

// ─── Fallback Logic ───────────────────────────────────────────────────────────

/**
 * Fetch pollution data from OpenWeather and convert to AQI format.
 */
export async function fetchPollutionFallback(lat: number, lng: number): Promise<AQIData> {
  console.log(`[AirSense] Falling back to OpenWeather for ${lat}, ${lng}...`);
  const res = await fetchWithTimeout(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${OWM_KEY}`
  );
  const json = await res.json();
  
  if (!json.list || json.list.length === 0) {
    throw new Error('OpenWeather pollution fetch failed');
  }

  const data = json.list[0];
  const pm25 = data.components.pm2_5;
  const aqi = calculateAQIFromPM(pm25);

  return {
    aqi: aqi,
    station: 'Estimated (OpenWeather)',
    dominantPollutant: 'pm25',
    time: new Date().toISOString(),
    iaqi: {
      pm25: { v: data.components.pm2_5 },
      pm10: { v: data.components.pm10 },
      no2: { v: data.components.no2 },
      o3: { v: data.components.o3 },
      so2: { v: data.components.so2 },
      co: { v: data.components.co / 1000 },
    },
    city: {
      name: 'Local area',
      geo: [lat, lng],
    },
    status: 'Estimated',
    source: 'OpenWeather',
    lastUpdated: new Date().toISOString(),
  };
}

// ─── Main API Functions ───────────────────────────────────────────────────────

async function fetchByUID(uid: number): Promise<AQIData> {
  const res = await fetchWithTimeout(
    `https://api.waqi.info/feed/@${uid}/?token=${WAQI_TOKEN}`,
    { cache: 'no-store' }
  );
  const json = await res.json();
  if (json.status !== 'ok') throw new Error(`Station @${uid} fetch failed`);
  return normalizeWAQI(json.data);
}

/**
 * Fetch stations within a bounding box. Used for Map and Nearby list.
 */
export async function fetchNearbyStations(lat: number, lng: number, d = 0.3): Promise<NearbyStation[]> {
  try {
    const res = await fetchWithTimeout(
      `https://api.waqi.info/map/bounds/?latlng=${lat - d},${lng - d},${lat + d},${lng + d}&token=${WAQI_TOKEN}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (json.status !== 'ok' || !json.data) return [];
    
    return json.data.map((s: any) => ({
      ...s,
      status: getStationStatus(s.station?.time, s.aqi && s.aqi !== '-')
    }));
  } catch (err) {
    console.error('[AirSense] fetchNearbyStations failed:', err);
    return [];
  }
}

export async function fetchAQIByGeo(lat: number, lng: number): Promise<AQIData> {
  try {
    const stations = await fetchNearbyStations(lat, lng);
    
    if (stations.length > 0) {
      const now = Date.now();
      const sorted = stations
        .filter(s => s.aqi && s.aqi !== '-' && s.aqi !== 'undefined')
        .sort((a, b) => {
          const parseTime = (s: string) => {
            if (!s) return 0;
            const dStr = s.replace(' ', 'T');
            const d = new Date(dStr);
            return isNaN(d.getTime()) ? 0 : d.getTime();
          };
          const tA = parseTime(a.station?.time);
          const tB = parseTime(b.station?.time);
          
          const isRecentA = (now - tA) < (24 * 60 * 60 * 1000);
          const isRecentB = (now - tB) < (24 * 60 * 60 * 1000);

          if (isRecentA && !isRecentB) return -1;
          if (!isRecentA && isRecentB) return 1;
          return Math.abs(tA - tB) > 3600000 ? tB - tA : Math.hypot(a.lat - lat, a.lon - lng) - Math.hypot(b.lat - lat, b.lon - lng);
        });

      if (sorted[0]) {
        const data = await fetchByUID(sorted[0].uid);
        if (data.status === 'Live') return data;
      }
    }
  } catch (err) {
    console.warn('[AirSense] WAQI Geo fetch failed, trying OWM fallback...', err);
  }

  return await fetchPollutionFallback(lat, lng);
}

export async function fetchAQIByCity(city: string): Promise<AQIData> {
  try {
    const res = await fetchWithTimeout(
      `https://api.waqi.info/search/?keyword=${encodeURIComponent(city)}&token=${WAQI_TOKEN}`
    );
    const json = await res.json();

    if (json.status === 'ok' && json.data?.length > 0) {
      const candidates = json.data.slice(0, 3);
      for (const cand of candidates) {
        if (cand.aqi !== '-') {
          const data = await fetchByUID(cand.uid);
          if (data.status === 'Live') return data;
        }
      }
    }
  } catch (err) {
    console.warn('[AirSense] WAQI City fetch failed, trying Geocode -> OWM...', err);
  }

  const geo = await geocodeCity(city);
  if (geo) return await fetchAQIByGeo(geo.lat, geo.lng);
  
  throw new Error(`Could not find air quality data for "${city}"`);
}

// ─── Search UI Helpers ────────────────────────────────────────────────────────

export async function searchStations(query: string) {
  if (!query.trim()) return [];
  const res = await fetch(`https://api.waqi.info/search/?keyword=${encodeURIComponent(query)}&token=${WAQI_TOKEN}`);
  const json = await res.json();
  if (json.status !== 'ok') return [];

  const seen = new Set<number>();
  return (json.data || []).map((s: any) => {
    if (seen.has(s.uid)) return null;
    seen.add(s.uid);
    
    const status = getStationStatus(s.station?.time, s.aqi && s.aqi !== '-');
    
    return {
      ...s,
      status
    };
  }).filter(Boolean);
}

// ─── Other APIs ───────────────────────────────────────────────────────────────

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OWM_KEY}&units=metric`);
  const json = await res.json();
  if (json.cod && json.cod !== 200) throw new Error(json.message);
  const T = json.main.temp;
  const RH = json.main.humidity;
  const dewPoint = T - ((100 - RH) / 5);
  return {
    temp: Math.round(json.main.temp * 10) / 10,
    feels_like: Math.round(json.main.feels_like * 10) / 10,
    humidity: json.main.humidity,
    pressure: json.main.pressure,
    visibility: Math.round((json.visibility || 10000) / 100) / 10,
    wind_speed: Math.round((json.wind?.speed || 0) * 3.6 * 10) / 10,
    wind_deg: json.wind?.deg || 0,
    description: json.weather?.[0]?.description || '',
    icon: json.weather?.[0]?.icon || '01d',
    dt: json.dt,
    sunrise: json.sys?.sunrise || 0,
    sunset: json.sys?.sunset || 0,
    dew_point: Math.round(dewPoint * 10) / 10,
  };
}

export async function fetchForecast(lat: number, lng: number): Promise<ForecastItem[]> {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${OWM_KEY}&units=metric`);
  const json = await res.json();
  if (!json.list) throw new Error('Forecast fetch failed');
  return json.list.map((item: any) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp * 10) / 10,
    icon: item.weather?.[0]?.icon || '01d',
    description: item.weather?.[0]?.description || '',
    pop: Math.round((item.pop || 0) * 100),
    humidity: item.main.humidity,
    wind_speed: Math.round((item.wind?.speed || 0) * 3.6 * 10) / 10,
    pressure: item.main.pressure,
  }));
}

export async function geocodeCity(city: string): Promise<{ lat: number; lng: number; name: string } | null> {
  try {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OWM_KEY}`);
    const json = await res.json();
    return json?.length > 0 ? { lat: json[0].lat, lng: json[0].lon, name: json[0].name } : null;
  } catch { return null; }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: { 'Accept-Language': 'en' }
    });
    const json = await res.json();
    const city = json.address?.city || json.address?.town || json.address?.village || 'Unknown';
    return city;
  } catch { return 'Unknown Location'; }
}
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchAQIByGeo, fetchWeather, fetchForecast, fetchNearbyStations, fetchAQIByCity } from '@/services/api';
import { useAppStore } from '@/store/useAppStore';

// ... (previous individual hooks remain same)

export function usePopularCities() {
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad'];
  return useQueries({
    queries: cities.map(city => ({
      queryKey: ['aqi-city', city],
      queryFn: () => fetchAQIByCity(city),
      staleTime: 30 * 60 * 1000, // 30 mins
    }))
  });
}

export function useAQI() {
  const location = useAppStore(s => s.location);
  return useQuery({
    queryKey: ['aqi', location?.lat, location?.lng],
    queryFn: () => fetchAQIByGeo(location!.lat, location!.lng),
    enabled: !!location,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useWeather() {
  const location = useAppStore(s => s.location);
  return useQuery({
    queryKey: ['weather', location?.lat, location?.lng],
    queryFn: () => fetchWeather(location!.lat, location!.lng),
    enabled: !!location,
    staleTime: 15 * 60 * 1000,
  });
}

export function useForecast() {
  const location = useAppStore(s => s.location);
  return useQuery({
    queryKey: ['forecast', location?.lat, location?.lng],
    queryFn: () => fetchForecast(location!.lat, location!.lng),
    enabled: !!location,
    staleTime: 30 * 60 * 1000,
  });
}

export function useNearbyStations() {
  const location = useAppStore(s => s.location);
  return useQuery({
    queryKey: ['stations', location?.lat, location?.lng],
    queryFn: () => fetchNearbyStations(location!.lat, location!.lng),
    enabled: !!location,
    staleTime: 30 * 60 * 1000,
  });
}

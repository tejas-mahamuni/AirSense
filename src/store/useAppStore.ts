import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Location {
  city: string;
  lat: number;
  lng: number;
}

interface AppState {
  activeTab: 'aqi' | 'weather' | 'tools';
  setActiveTab: (tab: 'aqi' | 'weather' | 'tools') => void;
  location: Location | null;
  setLocation: (loc: Location) => void;
  locationReady: boolean;
  setLocationReady: (v: boolean) => void;
  alertThreshold: number;
  setAlertThreshold: (v: number) => void;
  searchHistory: string[];
  addSearchHistory: (city: string) => void;
  persona: 'Normal' | 'Asthma' | 'Athlete';
  setPersona: (p: 'Normal' | 'Asthma' | 'Athlete') => void;
  watchlist: string[];
  addToWatchlist: (city: string) => void;
  removeFromWatchlist: (city: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'aqi',
      setActiveTab: (tab) => set({ activeTab: tab }),
      location: null,
      setLocation: (loc) => set({ location: loc, locationReady: true }),
      locationReady: false,
      setLocationReady: (v) => set({ locationReady: v }),
      alertThreshold: 150,
      setAlertThreshold: (v) => set({ alertThreshold: v }),
      searchHistory: [],
      addSearchHistory: (city) => {
        const prev = get().searchHistory.filter(c => c !== city);
        set({ searchHistory: [city, ...prev].slice(0, 5) });
      },
      persona: 'Normal',
      setPersona: (p) => set({ persona: p }),
      watchlist: [],
      addToWatchlist: (city) => {
        const prev = get().watchlist;
        if (!prev.includes(city)) set({ watchlist: [...prev, city] });
      },
      removeFromWatchlist: (city) => {
        set({ watchlist: get().watchlist.filter(c => c !== city) });
      },
    }),
    { name: 'airsense_store' }
  )
);

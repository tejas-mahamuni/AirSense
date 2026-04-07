import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X } from "lucide-react";
import { searchStations } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { getAQIColor } from "@/utils/colorMap";
import { getStatusTheme } from "@/utils/aqiUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  onRetryGeo: () => void;
}

export default function LocationModal({ open, onClose, onRetryGeo }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { setLocation, addSearchHistory, searchHistory } = useAppStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const data = await searchStations(q);
      setResults(data);
      setSearching(false);
    }, 400);
  }, []);

  const selectStation = (station: any) => {
    const name = station.station?.name || query;
    const lat = station.station?.geo?.[0] || 0;
    const lng = station.station?.geo?.[1] || 0;
    setLocation({ city: name, lat, lng });
    addSearchHistory(name);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Return") {
      e.preventDefault();
      if (results.length > 0) {
        selectStation(results[0]);
      }
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleRetry = () => {
    onClose();
    onRetryGeo();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="glass-card w-full max-w-md p-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 glass-button p-2 rounded-full"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📍</div>
              <h2 className="text-2xl font-semibold mb-2">Where are you?</h2>
              <p className="text-sm opacity-60">
                AirSense needs your location to show real-time air quality
              </p>
            </div>

            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search city, area, or pin code..."
                className="glass-input w-full py-3 pl-11 pr-4"
                autoFocus
              />
            </div>

            {searchHistory.length > 0 && !query && (
              <div className="mb-4">
                <p className="text-xs opacity-40 mb-2">Recent</p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSearch(city)}
                      className="glass-button px-3 py-1.5 text-xs"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto space-y-1">
              {searching && (
                <p className="text-center text-sm opacity-40 py-4">
                  Searching...
                </p>
              )}
              {results.map((r, i) => {
                const theme = getStatusTheme(r.status);
                return (
                  <button
                    key={r.uid || i}
                    onClick={() => selectStation(r)}
                    className="w-full text-left glass-button rounded-2xl p-4 flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-semibold truncate leading-tight mb-0.5">
                        {r.station?.name}
                      </p>
                      <p className="text-[10px] opacity-40 font-medium">
                        {r.station?.time || "No timestamp"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-white/5"
                          style={{
                            borderColor: theme.color + "40",
                            color: theme.color,
                          }}
                        >
                          {theme.label}
                        </span>
                        {r.aqi && r.aqi !== "-" && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              background: getAQIColor(Number(r.aqi)) + "33",
                              color: getAQIColor(Number(r.aqi)),
                            }}
                          >
                            {r.aqi}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleRetry}
              className="glass-button w-full py-3 mt-4 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <MapPin size={16} /> Use my location
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

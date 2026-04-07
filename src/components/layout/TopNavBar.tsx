import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { searchStations, fetchAQIByCity } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { getStatusTheme } from "@/utils/aqiUtils";
import { useGeolocation } from "@/hooks/useGeolocation";

const TopNavBar = () => {
  const routeLocation = useLocation();
  const { setLocation, addSearchHistory, searchHistory } = useAppStore();
  const { requestLocation: autoDetectLocation } = useGeolocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchStations(value);
        setResults(data.slice(0, 8));
        setShowDropdown(true);
      } catch {
        setResults([]);
      }
      setSearching(false);
    }, 400);
  }, []);

  const handleSelect = async (station: any) => {
    const stationUrl = station.station?.url || station.station?.name || "";
    const cityName = station.station?.name || "Unknown";

    setQuery("");
    setShowDropdown(false);
    setResults([]);

    try {
      // Fetch full station data to get guaranteed valid geo coordinates
      const data = await fetchAQIByCity(stationUrl);
      if (data && data.city?.geo) {
        setLocation({
          city: data.city.name || cityName,
          lat: data.city.geo[0],
          lng: data.city.geo[1],
        });
        addSearchHistory(data.city.name || cityName);
      }
    } catch {
      // Fallback: try using geo from search result directly
      const geo = station.station?.geo;
      if (Array.isArray(geo) && geo.length >= 2) {
        setLocation({
          city: cityName,
          lat: Number(geo[0]),
          lng: Number(geo[1]),
        });
        addSearchHistory(cityName);
      }
    }
  };

  const handleAutoDetect = () => {
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const { reverseGeocode } = await import("@/services/api");
          const city = await reverseGeocode(latitude, longitude);
          setLocation({ city, lat: latitude, lng: longitude });
          addSearchHistory(city);
        } catch (err) {
          console.error("Location error:", err);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation permission denied or error:", err);
        setDetectingLocation(false);
      },
      { timeout: 8000, enableHighAccuracy: false },
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm h-16">
      <nav className="flex justify-between items-center px-6 h-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/airsense.png"
              alt="AirSense"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-teal-900 font-headline">
              AirSense
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`font-label text-sm font-medium transition-all duration-300 pb-1 ${
                routeLocation.pathname === "/"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              to="/maps"
              className={`font-label text-sm font-medium transition-all duration-300 pb-1 ${
                routeLocation.pathname === "/maps"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Maps
            </Link>
            <Link
              to="/profile"
              className={`font-label text-sm font-medium transition-all duration-300 pb-1 ${
                routeLocation.pathname === "/profile"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 z-40">
          {/* Auto-detect location button */}
          <button
            onClick={handleAutoDetect}
            disabled={detectingLocation}
            className="relative z-40 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-low hover:bg-surface-container active:bg-surface-container-high transition-all disabled:opacity-50 cursor-pointer pointer-events-auto"
            title="Auto-detect current location"
            type="button"
          >
            {detectingLocation ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-outline">
                location_on
              </span>
            )}
          </button>

          {/* Search with dropdown */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <div className="relative flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/10">
              <span className="material-symbols-outlined text-outline text-lg">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm font-label ml-2 w-48 outline-none text-on-surface placeholder:text-outline"
                placeholder="Search city or station..."
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" || e.key === "Return") &&
                    results.length > 0
                  ) {
                    e.preventDefault();
                    handleSelect(results[0]);
                  }
                  if (e.key === "Escape") {
                    setShowDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (results.length > 0) setShowDropdown(true);
                  else if (query.length === 0 && searchHistory.length > 0)
                    setShowDropdown(true);
                }}
              />
              {searching && (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden z-50 max-h-80 overflow-y-auto">
                {/* Search History */}
                {query.length === 0 && searchHistory.length > 0 && (
                  <div className="p-3 border-b border-outline-variant/10">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 font-label">
                      Recent
                    </p>
                    {searchHistory.map((h, i) => (
                      <button
                        key={i}
                        className="block w-full text-left px-3 py-2 text-sm font-body text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
                        onClick={() => handleSearch(h)}
                      >
                        <span className="material-symbols-outlined text-sm text-outline mr-2 align-middle">
                          history
                        </span>
                        {h}
                      </button>
                    ))}
                  </div>
                )}

                {/* Results */}
                {results.map((station, i) => {
                  const theme = getStatusTheme(station.status);
                  return (
                    <button
                      key={station.uid || i}
                      className="block w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant/5 last:border-0"
                      onClick={() => handleSelect(station)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-headline text-on-surface truncate">
                            {station.station?.name || "Unknown Station"}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-body mt-0.5">
                            {station.station?.time || "No timestamp"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border"
                            style={{
                              background: theme.color + "15",
                              borderColor: theme.color + "30",
                              color: theme.color,
                            }}
                          >
                            {theme.label}
                          </span>
                          {station.aqi && station.aqi !== "-" && (
                            <span className="text-xs font-bold text-on-surface">
                              AQI {station.aqi}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {query.length >= 2 && results.length === 0 && !searching && (
                  <div className="p-8 text-center">
                    <span className="material-symbols-outlined text-outline text-3xl mb-2 opacity-20">
                      search_off
                    </span>
                    <p className="text-sm text-outline font-body">
                      No monitoring stations found
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link
            to="/profile"
            className={`hidden md:flex w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center transition-all ${
              routeLocation.pathname === "/profile"
                ? "border-primary bg-teal-100/50 dark:bg-teal-900/30"
                : "border-primary-container bg-surface-container-high hover:border-primary"
            }`}
            title="Go to profile"
          >
            <span
              className={`material-symbols-outlined text-lg ${
                routeLocation.pathname === "/profile"
                  ? "text-primary"
                  : "text-on-surface-variant"
              }`}
            >
              person
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default TopNavBar;

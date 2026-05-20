import { useEffect, useRef, useState } from "react";
import { useNearbyStations, useAQI, useWeather } from "@/hooks/useDataHooks";
import { useAppStore } from "@/store/useAppStore";
import { getAQIColor, getAQICategoryLabel } from "@/utils/colorMap";
import { fetchAQIByGeo } from "@/services/api"; // Added this to fetch full data by lat/lng or UID
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import EnvironmentalAnalysisModal from "../map/EnvironmentalAnalysisModal";
import { toast } from "sonner";

export default function AQIMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const location = useAppStore((s) => s.location);
  const { data: stations } = useNearbyStations();
  const { data: mainAQI } = useAQI();
  const { data: weatherData } = useWeather();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !location) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const map = L.map(mapRef.current, {
      center: [location.lat, location.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
      },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const createPopupContent = (station: any, isMain: boolean = false) => {
      const aqi = Number(station.aqi);
      const color = getAQIColor(aqi);
      const name = isMain ? (station.city?.name || location.city) : (station.station?.name || "Station");
      const source = isMain
        ? (station.source === "OpenWeather" ? "📡 OpenWeather (Estimated)" : "🏢 WAQI Station")
        : "🏢 WAQI Station";
      const temp = isMain ? weatherData?.temp : station.temp;
      const humidity = isMain ? weatherData?.humidity : station.humidity;

      return `
        <div class="aqi-popup-container" style="font-family: 'Manrope', sans-serif; padding: 12px; min-width: 200px;">
          <div style="margin-bottom: 8px;">
            <strong style="color: #2d3435; font-size: 14px; display: block; margin-bottom: 2px;">${name}</strong>
            <span style="font-size: 10px; color: #999; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">${source}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="color: ${color}; font-weight: 900; font-size: 32px; line-height: 1;">${aqi}</div>
            <div>
              <div style="font-size: 12px; font-weight: 800; color: ${color}; text-transform: uppercase;">${getAQICategoryLabel(aqi)}</div>
              <div style="font-size: 10px; color: #596062; font-weight: 600;">Air Quality Index</div>
            </div>
          </div>

          ${temp ? `
            <div style="display: flex; gap: 10px; margin-bottom: 12px; border-top: 1px solid #eee; pt: 8px; padding-top: 8px;">
              <div style="font-size: 11px; color: #596062;">🌡️ <b>${Number(temp).toFixed(1)}°C</b></div>
              <div style="font-size: 11px; color: #596062;">💧 <b>${Math.round(humidity || 0)}%</b></div>
            </div>
          ` : ''}

          <button 
            id="view-analysis-btn-${station.uid || (isMain ? 'main' : Math.random().toString(36).substr(2, 9))}" 
            class="analysis-btn"
            style="width: 100%; background: #2d3435; color: white; border: none; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s;"
          >
            Expand Analysis →
          </button>
        </div>
      `;
    };

    // Add nearby WAQI stations
    if (stations) {
      stations.forEach((station: any) => {
        if (!station.lat || !station.lon) return;
        const aqi = Number(station.aqi);
        if (isNaN(aqi)) return;
        const color = getAQIColor(aqi);

        const marker = L.circleMarker([station.lat, station.lon], {
          radius: 12,
          fillColor: color,
          fillOpacity: 0.85,
          color: "#ffffff",
          weight: 2,
        })
          .bindPopup(createPopupContent(station))
          .addTo(map);

        marker.on('popupopen', () => {
          const btnId = `view-analysis-btn-${station.uid || ''}`;
          const btn = document.getElementById(btnId);
          if (btn) {
            btn.onclick = async () => {
              try {
                setIsFetchingFull(true);
                toast.loading("Analyzing local atmosphere...", { id: "analysis-loading" });

                // Fetch full feed for this station
                const fullData = await fetchAQIByGeo(station.lat, station.lon);

                setSelectedStation({
                  stationName: fullData.station || station.station?.name || "Nearby Station",
                  aqi: fullData.aqi,
                  pollutants: fullData.iaqi || {},
                  weather: {
                    temp: weatherData?.temp || 25,
                    humidity: weatherData?.humidity || 50,
                    wind_speed: weatherData?.wind_speed || 5
                  },
                  lastUpdated: fullData.lastUpdated || new Date().toISOString(),
                  source: fullData.source === "OpenWeather" ? "OpenWeather (Estimated)" : "WAQI Station"
                });

                toast.dismiss("analysis-loading");
                setIsModalOpen(true);
              } catch (err) {
                toast.error("Failed to fetch detailed analysis");
                toast.dismiss("analysis-loading");
              } finally {
                setIsFetchingFull(false);
              }
            };
          }
        });
      });
    }

    // Add main location AQI
    if (mainAQI) {
      const aqi = mainAQI.aqi;
      const color = getAQIColor(aqi);

      const mainMarker = L.circleMarker([location.lat, location.lng], {
        radius: 16,
        fillColor: color,
        fillOpacity: 0.9,
        color: "#2d3435",
        weight: 3,
      })
        .bindPopup(createPopupContent(mainAQI, true))
        .addTo(map);

      // Pulse animation for high AQI
      if (aqi > 150) {
        const pulse = L.circleMarker([location.lat, location.lng], {
          radius: 16,
          fillColor: color,
          fillOpacity: 0.4,
          color: color,
          weight: 0,
        }).addTo(map);

        let grow = true;
        const interval = setInterval(() => {
          const radius = pulse.getRadius();
          if (grow) {
            pulse.setRadius(radius + 0.5);
            if (radius > 28) grow = false;
          } else {
            pulse.setRadius(radius - 0.5);
            if (radius < 18) grow = true;
          }
        }, 50);

        mainMarker.on('remove', () => clearInterval(interval));
      }

      mainMarker.on('popupopen', () => {
        const btn = document.getElementById('view-analysis-btn-main');
        if (btn) {
          btn.onclick = () => {
            setSelectedStation({
              stationName: mainAQI.city?.name || location.city,
              aqi: mainAQI.aqi,
              pollutants: mainAQI.iaqi || {},
              weather: {
                temp: weatherData?.temp || 25,
                humidity: weatherData?.humidity || 50,
                wind_speed: weatherData?.wind_speed || 5
              },
              lastUpdated: mainAQI.lastUpdated || new Date().toISOString(),
              source: mainAQI.source === "OpenWeather" ? "OpenWeather (Estimated)" : "WAQI Station"
            });
            setIsModalOpen(true);
          };
        }
      });
    }

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location, stations, mainAQI, weatherData]);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {selectedStation && (
        <EnvironmentalAnalysisModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedStation}
        />
      )}

      {isFetchingFull && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[10000] flex items-center justify-center pointer-events-none">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold font-headline text-on-surface uppercase tracking-widest">Deep Analysis in Progress...</p>
          </div>
        </div>
      )}
    </div>
  );
}



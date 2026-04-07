import { useEffect, useRef } from "react";
import { useNearbyStations, useAQI } from "@/hooks/useDataHooks";
import { useAppStore } from "@/store/useAppStore";
import { getAQIColor, getAQICategoryLabel } from "@/utils/colorMap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function AQIMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const location = useAppStore((s) => s.location);
  const { data: stations } = useNearbyStations();
  const { data: mainAQI } = useAQI();

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

    // Use a light-theme tile layer to match Stitch aesthetic
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
      },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add nearby WAQI stations
    if (stations) {
      stations.forEach((station: any) => {
        if (!station.lat || !station.lon) return;
        const aqi = Number(station.aqi);
        if (isNaN(aqi)) return;
        const color = getAQIColor(aqi);

        L.circleMarker([station.lat, station.lon], {
          radius: 12,
          fillColor: color,
          fillOpacity: 0.85,
          color: "#ffffff",
          weight: 2,
        })
          .bindPopup(
            `
            <div style="font-family: 'Manrope', sans-serif; padding: 6px;">
              <strong style="color: #2d3435;">${station.station?.name || "Station"}</strong><br/>
              <span style="color: ${color}; font-weight: bold; font-size: 22px;">${aqi}</span>
              <span style="font-size: 11px; color: #596062;"> ${getAQICategoryLabel(aqi)}</span>
            </div>
          `,
          )
          .addTo(map);
      });

      // Feature 4: Smart AQI Map - Clean Air Route Mock
      if (stations.length >= 3) {
        const sorted = [...stations]
          .filter((s) => !isNaN(Number(s.aqi)) && s.lat && s.lon)
          .sort((a, b) => Number(a.aqi) - Number(b.aqi))
          .slice(0, 3);

        if (sorted.length === 3) {
          const latlngs = [
            [location.lat, location.lng],
            ...sorted.map((s) => [s.lat, s.lon]),
          ];

          L.polyline(latlngs as L.LatLngExpression[], {
            color: "#4CAF50",
            weight: 4,
            opacity: 0.8,
            dashArray: "8, 8",
            lineJoin: "round",
          })
            .bindPopup(
              '<div style="font-family: Manrope, sans-serif;"><b>🌿 Clean Air Route</b><br/>Optimized path to reduce pollution exposure.</div>',
            )
            .addTo(map);
        }
      }
    }

    // Add main location AQI (includes OpenWeather fallback)
    if (mainAQI) {
      const aqi = mainAQI.aqi;
      const color = getAQIColor(aqi);
      const source =
        mainAQI.source === "OpenWeather"
          ? "📡 OpenWeather (Estimated)"
          : "🏢 WAQI Station";

      L.circleMarker([location.lat, location.lng], {
        radius: 14,
        fillColor: color,
        fillOpacity: 0.9,
        color: "#2d3435",
        weight: 3,
      })
        .bindPopup(
          `
          <div style="font-family: 'Manrope', sans-serif; padding: 8px;">
            <strong style="color: #2d3435;">${mainAQI.city?.name || location.city}</strong><br/>
            <span style="color: ${color}; font-weight: bold; font-size: 24px;">${aqi}</span>
            <span style="font-size: 11px; color: #596062;"> ${getAQICategoryLabel(aqi)}</span><br/>
            <span style="font-size: 10px; color: #999; margin-top: 4px;">${source}</span>
          </div>
        `,
        )
        .addTo(map);
    }

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location, stations, mainAQI]);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}

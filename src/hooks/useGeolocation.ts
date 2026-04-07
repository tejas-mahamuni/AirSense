import { useState, useEffect, useCallback } from "react";
import { reverseGeocode } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export function useGeolocation() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { location, setLocation, locationReady, setLocationReady } =
    useAppStore();

  const requestLocation = useCallback(() => {
    setLoading(true);

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      setShowModal(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const city = await reverseGeocode(latitude, longitude);
          setLocation({ city, lat: latitude, lng: longitude });
          setLocationReady(true);
        } catch (err) {
          console.error("Geolocation processing error:", err);
          setShowModal(true);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        // If permission denied or error, show modal for manual entry
        setShowModal(true);
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: false },
    );
  }, [setLocation, setLocationReady]);

  useEffect(() => {
    if (location) {
      setLocationReady(true);
      setLoading(false);
      return;
    }
    // Auto-request location on mount
    requestLocation();
  }, [location, requestLocation, setLocationReady]);

  return { showModal, setShowModal, loading, requestLocation };
}

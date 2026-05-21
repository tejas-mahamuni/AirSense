import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAQI, useWeather } from '@/hooks/useDataHooks';
import { detectAnomalies, EnvironmentalState } from '@/services/notifications/anomalyDetection';

export const useNotificationScheduler = () => {
  const { notificationsEnabled, notificationPreferences } = useAppStore();
  const { data: aqiData } = useAQI();
  const { data: weatherData } = useWeather();
  
  const previousStateRef = useRef<EnvironmentalState | null>(null);

  useEffect(() => {
    if (!notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;

    const checkSchedule = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const today = now.toDateString();
      
      // We only want to trigger EXACTLY when the minute is 00 to avoid spamming
      // but since intervals might drift, we check if we've already sent it today for that specific slot
      if (minutes === 0) {
        if (notificationPreferences.briefing && aqiData && weatherData) {
          const currentTemp = Math.round(weatherData.temp);
          const currentAqi = aqiData.aqi;
          const condition = weatherData.description || 'Clear';
          if (hour === 7) {
            const key = `notif_7am_${today}`;
            if (!localStorage.getItem(key)) {
              new Notification("AirSense Morning Briefing ☀️", {
                body: `Good morning! It's ${currentTemp}°C and ${condition}. The AQI is currently ${currentAqi}. Tap to view your full day outlook.`,
                icon: "/airsense.png"
              });
              localStorage.setItem(key, "true");
            }
          }
          if (hour === 12) {
            const key = `notif_12pm_${today}`;
            if (!localStorage.getItem(key)) {
              new Notification("AirSense Midday Update 🌤️", {
                body: `Midday check-in: The temperature is peaking at ${currentTemp}°C. Stay hydrated and monitor the AQI (${currentAqi}).`,
                icon: "/airsense.png"
              });
              localStorage.setItem(key, "true");
            }
          }
          if (hour === 21) {
            const key = `notif_9pm_${today}`;
            if (!localStorage.getItem(key)) {
              new Notification("AirSense Evening Summary 🌙", {
                body: `Good evening. The current temperature is ${currentTemp}°C. Tomorrow's forecast looks like ${condition}.`,
                icon: "/airsense.png"
              });
              localStorage.setItem(key, "true");
            }
          }
        }
      }
    };

    // Run schedule check every minute
    const interval = setInterval(checkSchedule, 60 * 1000);
    // Run immediately once
    checkSchedule();

    return () => clearInterval(interval);
  }, [notificationsEnabled, notificationPreferences.briefing, aqiData, weatherData]);

  // Anomaly Detection
  useEffect(() => {
    if (!notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted' || !aqiData || !weatherData) return;

    const currentState: EnvironmentalState = {
      aqi: aqiData.aqi,
      temp: weatherData.temp,
      condition: weatherData.description || "Clear"
    };

    const anomalies = detectAnomalies(currentState, previousStateRef.current);

    anomalies.forEach(anomaly => {
      // Check preferences
      if (anomaly.type === 'aqi' && !notificationPreferences.aqi) return;
      if ((anomaly.type === 'weather' || anomaly.type === 'heat') && !notificationPreferences.weather) return;

      // Prevent spamming the same anomaly within a 4-hour window
      const cacheKey = `anomaly_${anomaly.title}_${new Date().toDateString()}`;
      const lastSent = localStorage.getItem(cacheKey);
      const now = new Date().getTime();

      if (!lastSent || (now - parseInt(lastSent)) > (4 * 60 * 60 * 1000)) {
        new Notification(anomaly.title || "AirSense Alert", {
          body: anomaly.body,
          icon: "/airsense.png"
        });
        localStorage.setItem(cacheKey, now.toString());
      }
    });

    // Update previous state for the next check
    previousStateRef.current = currentState;

  }, [aqiData, weatherData, notificationsEnabled, notificationPreferences]);
};

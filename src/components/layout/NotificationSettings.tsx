import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { requestNotificationPermission } from '@/services/notifications/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { detectAnomalies } from '@/services/notifications/anomalyDetection';
import { useAQI, useWeather } from '@/hooks/useDataHooks';

export const NotificationSettings: React.FC = () => {
  const { notificationsEnabled, setNotificationsEnabled, notificationPreferences, setNotificationPreferences } = useAppStore();
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');

  const { data: aqiData } = useAQI();
  const { data: weatherData } = useWeather();

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const handleEnableToggle = async (checked: boolean) => {
    if (!('Notification' in window)) {
      toast.error("Notifications are not supported in this browser or over insecure HTTP (use localhost or HTTPS).");
      return;
    }
    if (checked) {
      if (permissionState !== 'granted') {
        const token = await requestNotificationPermission();
        if (Notification.permission === 'granted') {
          setPermissionState('granted');
          setNotificationsEnabled(true);
          toast.success("Notifications enabled successfully!");
        } else {
          toast.error("Failed to enable notifications. Please check browser settings.");
        }
      } else {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handlePrefChange = (key: keyof typeof notificationPreferences, checked: boolean) => {
    setNotificationPreferences({ [key]: checked });
  };

  const triggerSimulation = (type: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      toast.error("Please enable notifications first!");
      return;
    }

    let title = "";
    let body = "";
    
    const currentTemp = weatherData ? Math.round(weatherData.temp) : 25;
    const currentAqi = aqiData ? aqiData.aqi : 50;
    const condition = weatherData?.description || 'clear';

    switch (type) {
      case '7am':
        title = "AirSense Morning Briefing ☀️";
        body = `Good morning! It's ${currentTemp}°C and ${condition}. The AQI is currently ${currentAqi}. Tap to view your full day outlook.`;
        break;
      case '12pm':
        title = "AirSense Midday Update 🌤️";
        body = `Midday check-in: The temperature is peaking at ${currentTemp}°C. Stay hydrated and monitor the AQI (${currentAqi}).`;
        break;
      case '9pm':
        title = "AirSense Evening Summary 🌙";
        body = `Good evening. The current temperature is ${currentTemp}°C. Tomorrow's forecast looks like ${condition}.`;
        break;
      case 'aqi_drop':
        // We simulate a massive AQI drop by using the current AQI + 60
        const fakeHighAqi = currentAqi + 60;
        const aqiAnomalies = detectAnomalies({ aqi: fakeHighAqi, temp: currentTemp, condition }, { aqi: currentAqi, temp: currentTemp, condition });
        title = aqiAnomalies[0]?.title || "🚨 Sudden AQI Drop";
        body = aqiAnomalies[0]?.body || `Air quality has rapidly deteriorated to ${fakeHighAqi}.`;
        break;
      case 'rain':
        // We simulate rain by passing rain to current condition, but clear to previous
        const rainAnomalies = detectAnomalies({ aqi: currentAqi, temp: currentTemp, condition: 'heavy rain' }, { aqi: currentAqi, temp: currentTemp, condition: 'clear' });
        title = rainAnomalies[0]?.title || "🌧️ Rain Alert";
        body = rainAnomalies[0]?.body || `Conditions have changed to heavy rain. Precipitation is likely.`;
        break;
    }

    if ('Notification' in window) {
      new Notification(title, { body, icon: '/airsense.png' });
    }
    toast.success(`Simulated: ${title}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative">
          <span className="material-symbols-outlined">notifications</span>
          {notificationsEnabled && <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border border-surface"></span>}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-surface border-outline-variant/20 rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            Smart Alerts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10">
            <div>
              <p className="font-bold text-on-surface">Enable Push Notifications</p>
              <p className="text-xs text-on-surface-variant">Receive environmental alerts on this device</p>
            </div>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={handleEnableToggle} 
            />
          </div>

          {notificationsEnabled && (
            <div className="space-y-4 px-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-outline">Alert Types</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-on-surface text-sm">AQI Health Alerts</p>
                  <p className="text-[10px] text-on-surface-variant">Notify when air quality drops</p>
                </div>
                <Switch 
                  checked={notificationPreferences.aqi} 
                  onCheckedChange={(c) => handlePrefChange('aqi', c)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-on-surface text-sm">Weather Warnings</p>
                  <p className="text-[10px] text-on-surface-variant">Heatwaves, storms, extreme conditions</p>
                </div>
                <Switch 
                  checked={notificationPreferences.weather} 
                  onCheckedChange={(c) => handlePrefChange('weather', c)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-on-surface text-sm">Daily Briefing</p>
                  <p className="text-[10px] text-on-surface-variant">Smart morning/evening summary</p>
                </div>
                <Switch 
                  checked={notificationPreferences.briefing} 
                  onCheckedChange={(c) => handlePrefChange('briefing', c)} 
                />
              </div>
            </div>
          )}

          {/* Presentation Simulator */}
          <div className="pt-4 border-t border-outline-variant/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">science</span>
              Presentation Simulator
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => triggerSimulation('7am')} className="text-xs bg-surface-container py-2 px-3 rounded-xl font-bold text-on-surface hover:bg-surface-container-high transition-colors">
                Simulate 7 AM
              </button>
              <button onClick={() => triggerSimulation('12pm')} className="text-xs bg-surface-container py-2 px-3 rounded-xl font-bold text-on-surface hover:bg-surface-container-high transition-colors">
                Simulate 12 PM
              </button>
              <button onClick={() => triggerSimulation('9pm')} className="text-xs bg-surface-container py-2 px-3 rounded-xl font-bold text-on-surface hover:bg-surface-container-high transition-colors">
                Simulate 9 PM
              </button>
              <button onClick={() => triggerSimulation('aqi_drop')} className="text-xs bg-error/10 text-error py-2 px-3 rounded-xl font-bold hover:bg-error/20 transition-colors">
                Simulate AQI Drop
              </button>
              <button onClick={() => triggerSimulation('rain')} className="text-xs bg-blue-500/10 text-blue-600 py-2 px-3 rounded-xl font-bold hover:bg-blue-500/20 transition-colors col-span-2">
                Simulate Rain Alert
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import React, { useEffect } from 'react';
import AIInsightCard from './AIInsightCard';
import { useAIDailyBriefing } from '@/hooks/useAIInsights';
import { useAQI } from '@/hooks/useDataHooks';
import { useAppStore } from '@/store/useAppStore';
import { showSafeNotification } from '@/utils/notificationHelper';

const AIDailyBriefing: React.FC = () => {
  const { data: aiContent, isLoading, isError } = useAIDailyBriefing();
  const { data: aqiData } = useAQI();
  
  const hour = new Date().getHours();
  let timeGreeting = "Night";
  if (hour >= 4 && hour < 5) {
    timeGreeting = "Early Morning";
  } else if (hour >= 5 && hour < 12) {
    timeGreeting = "Morning";
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = "Afternoon";
  } else if (hour >= 17 && hour < 20) {
    timeGreeting = "Evening";
  }

  const fallbackInsight = aqiData 
    ? `Good ${timeGreeting}! The current AQI is ${aqiData.aqi}. Please take standard precautions based on this level.` 
    : `Good ${timeGreeting}! Setting up your daily briefing...`;

  const { notificationsEnabled, notificationPreferences } = useAppStore();

  useEffect(() => {
    if (aiContent && notificationsEnabled && notificationPreferences.briefing && 'Notification' in window && Notification.permission === 'granted') {
      // Check if we haven't already sent a briefing notification today to prevent spam
      const lastSent = localStorage.getItem('last_briefing_notif');
      const today = new Date().toDateString();
      
      if (lastSent !== today) {
        showSafeNotification(`AirSense ${timeGreeting} Briefing`, {
          body: aiContent
        });
        localStorage.setItem('last_briefing_notif', today);
      }
    }
  }, [aiContent, notificationsEnabled, notificationPreferences.briefing, timeGreeting]);

  return (
    <div className="mb-6">
      <AIInsightCard 
        title={`${timeGreeting} Briefing`} 
        icon="brightness_5" 
        content={aiContent} 
        isLoading={isLoading} 
        isError={isError}
        fallbackContent={fallbackInsight}
      />
    </div>
  );
};

export default AIDailyBriefing;

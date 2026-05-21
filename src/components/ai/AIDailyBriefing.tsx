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
  const isMorning = hour < 12;
  const timeGreeting = isMorning ? "Morning" : "Evening";

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

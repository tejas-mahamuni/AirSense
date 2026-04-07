import React from 'react';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';

import { useAQI } from '@/hooks/useDataHooks';
import { useAppStore } from '@/store/useAppStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

const SmartAlert = () => {
  const { data: aqiData } = useAQI();
  const { alertThreshold } = useAppStore();

  if (!aqiData || (aqiData.aqi || 0) < alertThreshold) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top fade-in border border-red-700 font-headline font-bold text-sm">
      <span className="material-symbols-outlined text-[18px]">warning</span>
      Air quality worsening rapidly. AQI is {aqiData.aqi}. Limit outdoor exposure.
    </div>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body relative">
      <TopNavBar />
      <SmartAlert />
      {children}
      <BottomNavBar />
    </div>
  );
};

export default AppLayout;

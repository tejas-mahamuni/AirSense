import { useAppStore } from '@/store/useAppStore';

export default function AQIWeatherToggle() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="flex justify-center mb-8">
      <div className="glass-panel p-1 rounded-full flex gap-1 shadow-sm">
        <button
          className={`px-6 py-2.5 rounded-full text-sm font-bold font-label transition-all duration-300 ${
            activeTab === 'aqi'
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          onClick={() => setActiveTab('aqi')}
        >
          <span className="mr-1.5">🌫️</span>Air Quality
        </button>
        <button
          className={`px-6 py-2.5 rounded-full text-sm font-bold font-label transition-all duration-300 ${
            activeTab === 'weather'
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          onClick={() => setActiveTab('weather')}
        >
          <span className="mr-1.5">🌤️</span>Weather
        </button>
        <button
          className={`px-6 py-2.5 rounded-full text-sm font-bold font-label transition-all duration-300 ${
            activeTab === 'tools'
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          onClick={() => setActiveTab('tools')}
        >
          <span className="mr-1.5">🔬</span>Insights
        </button>
      </div>
    </div>
  );
}

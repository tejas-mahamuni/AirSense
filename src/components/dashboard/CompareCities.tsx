import { useState } from 'react';
import { fetchAQIByCity, fetchWeather, fetchForecast, AQIData, WeatherData, ForecastItem } from '@/services/api';
import { getAQIColor } from '@/utils/colorMap';
import { useAppStore } from '@/store/useAppStore';

export default function CompareCities() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAppStore();
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [data1, setData1] = useState<{ aqi: AQIData, weather: WeatherData, rain: number } | null>(null);
  const [data2, setData2] = useState<{ aqi: AQIData, weather: WeatherData, rain: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!city1 || !city2) return;
    setLoading(true);
    setError('');
    try {
      const [res1, res2] = await Promise.all([
        fetchAQIByCity(city1),
        fetchAQIByCity(city2)
      ]);
      
      const [w1, f1, w2, f2] = await Promise.all([
        fetchWeather(res1.city.geo[0], res1.city.geo[1]),
        fetchForecast(res1.city.geo[0], res1.city.geo[1]),
        fetchWeather(res2.city.geo[0], res2.city.geo[1]),
        fetchForecast(res2.city.geo[0], res2.city.geo[1])
      ]);

      setData1({ aqi: res1, weather: w1, rain: f1[0]?.pop || 0 });
      setData2({ aqi: res2, weather: w2, rain: f2[0]?.pop || 0 });
    } catch (e: any) {
      setError(e.message || 'Comparison failed. Check city names.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h2 className="text-lg font-bold font-headline text-on-surface mb-2">⚖️ Compare Cities</h2>
      <p className="text-xs text-on-surface-variant font-body mb-6">
        See how air quality differs between two locations.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="City 1 (e.g., Delhi)" 
          value={city1} 
          onChange={e => setCity1(e.target.value)} 
          className="flex-1 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary font-body text-sm"
        />
        <div className="flex items-center justify-center font-bold text-outline-variant text-[10px] uppercase">Vs</div>
        <input 
          type="text" 
          placeholder="City 2 (e.g., London)" 
          value={city2} 
          onChange={e => setCity2(e.target.value)} 
          className="flex-1 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary font-body text-sm"
        />
        <button 
          onClick={handleCompare} 
          disabled={!city1 || !city2 || loading}
          className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold px-6 py-3 rounded-xl transition-colors font-headline"
        >
          {loading ? '...' : 'Compare'}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {data1 && data2 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-outline-variant/20 -translate-x-1/2 hidden sm:block"></div>
          
          {[data1, data2].map((data, idx) => {
            const cityName = data.aqi.city.name;
            const isStarred = watchlist.includes(cityName);
            const toggleStar = () => isStarred ? removeFromWatchlist(cityName) : addToWatchlist(cityName);
            
            return (
              <div key={idx} className="text-center p-4 bg-surface-container-low rounded-2xl shadow-sm border border-outline-variant/5">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <h3 className="font-bold text-xl font-headline truncate max-w-[200px]" title={cityName}>{cityName}</h3>
                  <button onClick={toggleStar} className="text-xl hover:scale-110 transition-transform focus:outline-none">
                    {isStarred ? '⭐' : '☆'}
                  </button>
                </div>
                
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 shadow-inner" style={{ backgroundColor: getAQIColor(data.aqi.aqi) + '20', border: `4px solid ${getAQIColor(data.aqi.aqi)}` }}>
                  <span className="text-3xl sm:text-4xl font-black" style={{ color: getAQIColor(data.aqi.aqi) }}>{data.aqi.aqi}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label font-bold mb-4">
                  Primary Pollutant: {data.aqi.dominantPollutant.toUpperCase()}
                </p>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">Weather</p>
                    <p className="font-bold text-on-surface text-sm">{data.weather.temp}°C</p>
                    <p className="text-[10px] text-on-surface-variant capitalize truncate">{data.weather.description}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">Rain Risk</p>
                    <p className="font-bold text-on-surface text-sm">{data.rain}%</p>
                    <p className="text-[10px] text-on-surface-variant">Probability</p>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">Humidity</p>
                    <p className="font-bold text-on-surface text-sm">{data.weather.humidity}%</p>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">Wind</p>
                    <p className="font-bold text-on-surface text-sm">{data.weather.wind_speed} <span className="text-[10px] font-normal text-on-surface-variant">km/h</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

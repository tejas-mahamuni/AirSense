import { useState } from 'react';
import { fetchAQIByCity, AQIData } from '@/services/api';
import { getAQIColor } from '@/utils/colorMap';

export default function CompareCities() {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [data1, setData1] = useState<AQIData | null>(null);
  const [data2, setData2] = useState<AQIData | null>(null);
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
      setData1(res1);
      setData2(res2);
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
          
          <div className="text-center p-4">
            <h3 className="font-bold text-xl font-headline mb-4">{data1.city.name}</h3>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 shadow-inner" style={{ backgroundColor: getAQIColor(data1.aqi) + '20', border: `4px solid ${getAQIColor(data1.aqi)}` }}>
              <span className="text-4xl font-black" style={{ color: getAQIColor(data1.aqi) }}>{data1.aqi}</span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-label font-bold">
              Dominant: {data1.dominantPollutant.toUpperCase()}
            </p>
          </div>

          <div className="text-center p-4">
            <h3 className="font-bold text-xl font-headline mb-4">{data2.city.name}</h3>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 shadow-inner" style={{ backgroundColor: getAQIColor(data2.aqi) + '20', border: `4px solid ${getAQIColor(data2.aqi)}` }}>
              <span className="text-4xl font-black" style={{ color: getAQIColor(data2.aqi) }}>{data2.aqi}</span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-label font-bold">
              Dominant: {data2.dominantPollutant.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

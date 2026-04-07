import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { fetchAQIByCity, AQIData } from '@/services/api';
import { getAQIColor } from '@/utils/colorMap';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useAppStore();
  const [watchlistData, setWatchlistData] = useState<Record<string, AQIData | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWatclist = async () => {
      if (watchlist.length === 0) return;
      setLoading(true);
      const data: Record<string, AQIData | null> = {};
      for (const city of watchlist) {
        try {
          data[city] = await fetchAQIByCity(city);
        } catch {
          data[city] = null;
        }
      }
      setWatchlistData(data);
      setLoading(false);
    };
    loadWatclist();
  }, [watchlist]);

  if (watchlist.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 text-center border border-outline-variant/10">
        <span className="text-4xl block mb-2">⭐</span>
        <h2 className="text-lg font-bold font-headline text-on-surface">Multi-City Watchlist</h2>
        <p className="text-sm text-on-surface-variant font-body">Use the search bar to find cities and add them to your watchlist.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h2 className="text-lg font-bold font-headline text-on-surface mb-4">⭐ Watchlist</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-surface-container rounded-xl w-full"></div>
          <div className="h-16 bg-surface-container rounded-xl w-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {watchlist.map(city => {
            const data = watchlistData[city];
            if (!data) return (
              <div key={city} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <span className="font-bold text-on-surface">{city}</span>
                <span className="text-xs text-outline">Unavailable</span>
                <button onClick={() => removeFromWatchlist(city)} className="text-red-500 text-xs">Remove</button>
              </div>
            );

            const color = getAQIColor(data.aqi);

            return (
              <div key={city} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: color }}></div>
                <div className="pl-2">
                  <h3 className="font-bold font-headline text-on-surface text-base">{city}</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">AQI: <span style={{ color, fontWeight: 'bold' }}>{data.aqi}</span></p>
                </div>
                
                <button 
                  onClick={() => removeFromWatchlist(city)} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  title="Remove from watchlist"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

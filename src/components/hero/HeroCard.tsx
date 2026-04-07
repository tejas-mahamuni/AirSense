import { motion } from 'framer-motion';
import { MapPin, Share2, Bell, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAQI } from '@/hooks/useDataHooks';
import { getAQIColor, getAQICategoryLabel, getHealthAdvice } from '@/utils/colorMap';
import { validateAQI } from '@/utils/apiValidator';
import AnimatedNumber from './AnimatedNumber';

export default function HeroCard() {
  const location = useAppStore(s => s.location);
  const { data: aqiData, isLoading } = useAQI();

  const aqi = validateAQI(aqiData?.aqi) ?? 0;
  const color = getAQIColor(aqi);
  const category = getAQICategoryLabel(aqi);
  const advice = getHealthAdvice(aqi);

  return (
    <motion.div
      className="glass-card p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-foreground opacity-60" />
          <span className="text-sm text-foreground opacity-70">{location?.city || 'Loading...'}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground opacity-50">
          <div className="live-dot" />
          <span>Live</span>
          <Clock size={12} />
          <span>Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {isLoading ? (
          <div className="h-24 flex items-center">
            <div className="w-32 h-20 rounded-2xl animate-pulse bg-muted" />
          </div>
        ) : (
          <>
            <div className="flex items-end gap-4">
              <AnimatedNumber value={aqi} color={color} />
              <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold mb-2"
                style={{ background: color + '22', color, border: `1px solid ${color}44` }}
              >
                {category}
              </span>
            </div>

            <p className="text-sm text-foreground opacity-70 max-w-md">{advice}</p>

            <div className="flex gap-2 mt-2">
              <button className="glass-button px-4 py-2 text-xs flex items-center gap-1.5">
                <Share2 size={13} /> Share
              </button>
              <button className="glass-button px-4 py-2 text-xs flex items-center gap-1.5">
                <Bell size={13} /> Set Alert
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

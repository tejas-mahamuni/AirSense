import { MapPin, Pencil, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  onEditLocation: () => void;
  lastUpdated?: string;
}

export default function Header({ onEditLocation, lastUpdated }: Props) {
  const location = useAppStore(s => s.location);

  return (
    <header className="relative z-10 px-4 sm:px-6 pt-4 pb-2">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="opacity-80">Air</span>Sense
          </h1>
        </div>

        {location && (
          <button
            onClick={onEditLocation}
            className="glass-button px-4 py-2 flex items-center gap-2 text-sm"
          >
            <MapPin size={14} />
            <span className="max-w-[180px] truncate">{location.city}</span>
            <Pencil size={12} className="opacity-50" />
          </button>
        )}
      </div>
    </header>
  );
}

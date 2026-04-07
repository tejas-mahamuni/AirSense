import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  color: string;
}

export default function AnimatedNumber({ value, color }: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        ref.current = value;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value]);

  return (
    <span
      className="text-7xl sm:text-8xl font-bold tabular-nums tracking-tighter leading-none"
      style={{ color }}
    >
      {display}
    </span>
  );
}

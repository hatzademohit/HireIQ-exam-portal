import { useState, useEffect, useRef } from 'react';

/** Counts up from 0. Returns elapsed seconds and a formatted MM:SS string. */
export function useCountUpTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const reset = () => setSeconds(0);
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return { seconds, formatted, reset };
}

/** Counts down from `initial` seconds. Calls onExpire when done. */
export function useCountDownTimer(initial: number, running: boolean, onExpire?: () => void) {
  const [seconds, setSeconds] = useState(initial);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(initial);
  }, [initial]);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            if (ref.current) clearInterval(ref.current);
            onExpire?.();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return { seconds, formatted };
}

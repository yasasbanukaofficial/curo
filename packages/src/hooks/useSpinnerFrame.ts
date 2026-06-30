import { useState, useEffect, useRef } from 'react';

const braille = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'];

export function useSpinnerFrame(delay = 80) {
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFrame((f) => (f + 1) % braille.length);
    }, delay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [delay]);

  return braille[frame];
}

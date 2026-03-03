// src/features/auth/hooks/useHoldToPeek.ts
import { useEffect, useRef, useState } from "react";

export function useHoldToPeek(durationMs = 2000) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clear = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    clear();
    setShow(true);
    timerRef.current = window.setTimeout(() => {
      setShow(false);
      timerRef.current = null;
    }, durationMs);
  };

  const stop = () => {
    clear();
    setShow(false);
  };

  useEffect(() => () => clear(), []);

  return { show, start, stop };
}

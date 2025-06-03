import { useState, useEffect, useRef } from "react";
import { TIMER_UPDATE_INTERVAL } from "../utils/constants";

export const useTimer = (isActive) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setElapsedTime(elapsed);
        }
      }, TIMER_UPDATE_INTERVAL);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isActive]);

  const formatTime = (seconds) => {
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)}ms`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  return { elapsedTime, formatTime };
};

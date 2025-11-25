import { useEffect, useState } from "react";

export function useCountdown(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || time <= 0) return;

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, time]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => setTime(initialTime);

  return { time, start, stop, reset, isRunning };
}
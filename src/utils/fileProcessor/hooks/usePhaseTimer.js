import { useState, useCallback } from "react";

export const usePhaseTimer = () => {
  const [phaseTimings, setPhaseTimings] = useState({
    filtering: 0,
    processing: 0,
    building: 0,
    ascii: 0,
  });

  const [currentPhase, setCurrentPhase] = useState(null);
  const [phaseStartTime, setPhaseStartTime] = useState(null);

  const startPhase = useCallback((phaseName) => {
    setCurrentPhase(phaseName);
    setPhaseStartTime(performance.now());
  }, []);

  const endPhase = useCallback(() => {
    if (currentPhase && phaseStartTime) {
      const elapsed = (performance.now() - phaseStartTime) / 1000;
      setPhaseTimings((prev) => ({
        ...prev,
        [currentPhase]: elapsed,
      }));
    }
    setCurrentPhase(null);
    setPhaseStartTime(null);
  }, [currentPhase, phaseStartTime]);

  const resetTimings = useCallback(() => {
    setPhaseTimings({
      filtering: 0,
      processing: 0,
      building: 0,
      ascii: 0,
    });
    setCurrentPhase(null);
    setPhaseStartTime(null);
  }, []);

  return {
    phaseTimings,
    currentPhase,
    startPhase,
    endPhase,
    resetTimings,
  };
};

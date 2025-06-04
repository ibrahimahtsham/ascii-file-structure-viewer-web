import { PHASE_RANGES } from "./constants.js";

export const calculateProgress = (processedCount, totalFiles, phase) => {
  const phaseRange = PHASE_RANGES[phase];
  if (!phaseRange) return 0;

  const phaseProgress = totalFiles > 0 ? processedCount / totalFiles : 0;
  const phaseSpan = phaseRange.end - phaseRange.start;

  return phaseRange.start + phaseProgress * phaseSpan;
};

export const createProgressReporter = (onProgress, phaseTimings) => {
  return (phase, processedCount, totalFiles) => {
    const progress = calculateProgress(processedCount, totalFiles, phase);

    if (onProgress) {
      onProgress(progress, processedCount, totalFiles, phaseTimings);
    }
  };
};

export const yieldControl = (interval = 1) => {
  return new Promise((resolve) => setTimeout(resolve, interval));
};

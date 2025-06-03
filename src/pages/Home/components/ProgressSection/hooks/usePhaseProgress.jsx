import { useMemo } from "react";
import { PHASE_ORDER } from "../utils/constants";

export const usePhaseProgress = (loading, progress, fileData) => {
  const phases = useMemo(() => {
    if (!loading && fileData?.stats?.processingTime) {
      // Show all phases as completed when processing is done
      return {
        filtering: 100,
        processing: 100,
        building: 100,
        ascii: 100,
        currentPhase: "completed",
      };
    }

    const { percent } = progress;

    if (percent <= 5) {
      return {
        filtering: Math.min((percent / 5) * 100, 100),
        processing: 0,
        building: 0,
        ascii: 0,
        currentPhase: "filtering",
      };
    } else if (percent <= 90) {
      return {
        filtering: 100,
        processing: Math.min(((percent - 5) / 85) * 100, 100),
        building: 0,
        ascii: 0,
        currentPhase: "processing",
      };
    } else if (percent <= 95) {
      return {
        filtering: 100,
        processing: 100,
        building: Math.min(((percent - 90) / 5) * 100, 100),
        ascii: 0,
        currentPhase: "building",
      };
    } else {
      return {
        filtering: 100,
        processing: 100,
        building: 100,
        ascii: Math.min(((percent - 95) / 5) * 100, 100),
        currentPhase: "ascii",
      };
    }
  }, [loading, progress, fileData]);

  const isCompleted = !loading && fileData?.stats?.processingTime;

  return { phases, isCompleted };
};

import { Paper, Box } from "@mui/material";
import { usePhaseProgress } from "./hooks/usePhaseProgress";
import OverallProgress from "./components/OverallProgress";
import PhaseBreakdown from "./components/PhaseBreakdown";

function ProgressSection({
  loading,
  progress,
  elapsedTime,
  formatTime,
  fileData,
}) {
  const { phases, isCompleted } = usePhaseProgress(loading, progress, fileData);

  // Don't show anything if we haven't started processing and have no completed data
  if (!loading && !fileData?.stats?.processingTime) {
    return null;
  }

  // Get phase timings from progress or completed fileData
  const phaseTimings = loading
    ? progress.phaseTimings
    : fileData?.stats?.phaseTimings || {};

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ textAlign: "center" }}>
        <OverallProgress
          loading={loading}
          progress={progress}
          isCompleted={isCompleted}
          elapsedTime={elapsedTime}
          formatTime={formatTime}
          fileData={fileData}
        />

        <PhaseBreakdown
          phases={phases}
          isCompleted={isCompleted}
          phaseTimings={phaseTimings}
        />
      </Box>
    </Paper>
  );
}

export default ProgressSection;

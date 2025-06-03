import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import { CheckCircle, Timer } from "@mui/icons-material";
import { PROGRESS_MESSAGES } from "../utils/constants";

function OverallProgress({
  loading,
  progress,
  isCompleted,
  elapsedTime,
  formatTime,
  fileData,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isCompleted && <CheckCircle sx={{ mr: 1, color: "success.main" }} />}
        {isCompleted
          ? PROGRESS_MESSAGES.COMPLETE
          : PROGRESS_MESSAGES.PROCESSING}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={isCompleted ? 100 : progress.percent}
        sx={{
          mb: 2,
          height: 12,
          borderRadius: 6,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 6,
            backgroundColor: isCompleted ? "success.main" : "primary.main",
          },
        }}
      />

      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Processing {progress.current.toLocaleString()} of{" "}
          {progress.total.toLocaleString()} files ({progress.percent}%)
        </Typography>
      )}

      {isCompleted && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Successfully processed {fileData.stats.totalFiles.toLocaleString()}{" "}
          files
        </Typography>
      )}

      {/* Timer */}
      {loading && (
        <Chip
          icon={<Timer />}
          label={`Processing time: ${formatTime(elapsedTime)}`}
          color="primary"
          variant="outlined"
          clickable={false}
          sx={{
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.7 },
              "100%": { opacity: 1 },
            },
          }}
        />
      )}

      {isCompleted && (
        <Chip
          icon={<Timer />}
          label={`Processed in ${formatTime(fileData.stats.processingTime)}`}
          color="success"
          variant="outlined"
          clickable={false}
          sx={{
            cursor: "default",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:focus": {
              backgroundColor: "transparent",
            },
          }}
        />
      )}
    </Box>
  );
}

export default OverallProgress;

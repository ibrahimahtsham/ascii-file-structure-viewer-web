import { Box, Typography, LinearProgress } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { PHASE_CONFIG } from "../utils/constants";

function PhaseCard({ phase, progress, isActive, isOverallCompleted, timing }) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;
  const isPhaseCompleted = progress === 100;

  const formatTime = (seconds) => {
    if (seconds === 0) return "";
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)}ms`;
    }
    return `${seconds.toFixed(2)}s`;
  };

  const getTimingDisplay = () => {
    if (!timing || timing === 0) return "";

    if (isPhaseCompleted) {
      return ` • ${formatTime(timing)}`;
    } else if (isActive && timing > 0) {
      return ` • ${formatTime(timing)}...`;
    }
    return "";
  };

  return (
    <Box
      sx={{
        p: 1.5,
        border: 1,
        borderColor: isPhaseCompleted
          ? "success.main"
          : isActive
          ? "primary.main"
          : "divider",
        borderRadius: 1,
        backgroundColor: (theme) => {
          if (isPhaseCompleted) {
            return theme.palette.mode === "dark"
              ? "rgba(76, 175, 80, 0.1)"
              : "rgba(76, 175, 80, 0.08)";
          } else if (isActive) {
            return theme.palette.action.selected;
          } else {
            return "transparent";
          }
        },
        transition: "all 0.3s ease",
        opacity: isOverallCompleted
          ? 1
          : isPhaseCompleted || isActive
          ? 1
          : 0.7,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Icon
          sx={{
            mr: 1,
            fontSize: 16,
            color: isPhaseCompleted
              ? "success.main"
              : isActive
              ? "primary.main"
              : "text.secondary",
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: isActive || isPhaseCompleted ? 600 : 400,
              color: isPhaseCompleted
                ? "success.main"
                : isActive
                ? "primary.main"
                : "text.secondary",
              lineHeight: 1.2,
            }}
          >
            {config.label}
          </Typography>
          {getTimingDisplay() && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.65rem",
                color: "text.secondary",
                fontStyle: isActive && !isPhaseCompleted ? "italic" : "normal",
                lineHeight: 1,
                mt: 0.25,
              }}
            >
              {getTimingDisplay()}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isPhaseCompleted && (
            <CheckCircle sx={{ fontSize: 16, color: "success.main", mr: 1 }} />
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: isPhaseCompleted
                ? "success.main"
                : isActive
                ? "primary.main"
                : "text.secondary",
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            backgroundColor: isPhaseCompleted
              ? "success.main"
              : isActive
              ? "primary.main"
              : "text.disabled",
          },
        }}
      />
    </Box>
  );
}

export default PhaseCard;

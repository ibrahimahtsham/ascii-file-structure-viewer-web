import { Box, Typography, Grid } from "@mui/material";
import PhaseCard from "./PhaseCard";
import { PHASE_ORDER, PROGRESS_MESSAGES } from "../utils/constants";

function PhaseBreakdown({ phases, isCompleted, phaseTimings = {} }) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
        {isCompleted ? PROGRESS_MESSAGES.SUMMARY : PROGRESS_MESSAGES.PHASES}
      </Typography>
      <Grid container spacing={2}>
        {PHASE_ORDER.map((phase) => {
          const progress = phases[phase];
          const isActive = phases.currentPhase === phase;
          const timing = phaseTimings[phase] || 0;

          return (
            <Grid key={phase} size={{ xs: 12, sm: 6 }}>
              <PhaseCard
                phase={phase}
                progress={progress}
                isActive={isActive}
                isOverallCompleted={isCompleted}
                timing={timing}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default PhaseBreakdown;

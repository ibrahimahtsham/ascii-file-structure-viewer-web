import { Box, Typography } from "@mui/material";

function StatisticsSection({ selectedCount, filteredCount }) {
  const percentage =
    filteredCount > 0 ? ((selectedCount / filteredCount) * 100).toFixed(1) : 0;

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
      <Typography variant="body2">
        <strong>Selected:</strong> {selectedCount} of {filteredCount} files (
        {percentage}%)
      </Typography>
    </Box>
  );
}

export default StatisticsSection;

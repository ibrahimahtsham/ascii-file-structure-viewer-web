import { Chip, Stack } from "@mui/material";

function StatisticsChips({ stats }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
      <Chip
        label={`${stats.totalFiles} files`}
        size="small"
        color="primary"
        variant="outlined"
      />
      <Chip
        label={`${stats.totalFolders} folders`}
        size="small"
        color="secondary"
        variant="outlined"
      />
      {stats.ignoredCount > 0 && (
        <Chip
          label={`${stats.ignoredCount} ignored`}
          size="small"
          color="warning"
          variant="outlined"
        />
      )}
    </Stack>
  );
}

export default StatisticsChips;

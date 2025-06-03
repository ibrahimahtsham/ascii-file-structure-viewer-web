import {
  Paper,
  Typography,
  Grid,
  Chip,
  Box,
  LinearProgress,
} from "@mui/material";
import { BarChart, Code, FolderOpen, Description } from "@mui/icons-material";

function CodeStats({ stats }) {
  if (!stats) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Code Statistics</Typography>
        <Typography variant="body2" color="text.secondary">
          No statistics available. Please select a folder.
        </Typography>
      </Paper>
    );
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const topFileTypes = Object.entries(stats.fileTypes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <BarChart sx={{ mr: 1 }} />
        Code Statistics
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Description sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="body2">
              <strong>Total Files:</strong> {stats.totalFiles.toLocaleString()}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Code sx={{ mr: 1, color: "secondary.main" }} />
            <Typography variant="body2">
              <strong>Total Lines:</strong> {stats.totalLines.toLocaleString()}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <FolderOpen sx={{ mr: 1, color: "success.main" }} />
            <Typography variant="body2">
              <strong>Total Size:</strong> {formatBytes(stats.totalSize)}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            <strong>Largest File:</strong> {stats.largestFile.name}
            {stats.largestFile.lines > 0 &&
              ` (${stats.largestFile.lines} lines)`}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Top File Types:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {topFileTypes.map(([ext, count]) => (
            <Chip
              key={ext}
              label={`${ext || "no-ext"} (${count})`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

export default CodeStats;

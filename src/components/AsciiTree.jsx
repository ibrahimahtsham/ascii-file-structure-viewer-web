import { Paper, Typography, Box } from "@mui/material";
import { AccountTree } from "@mui/icons-material";

function AsciiTree({ asciiTree }) {
  if (!asciiTree) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">ASCII Tree View</Typography>
        <Typography variant="body2" color="text.secondary">
          No tree structure available. Please select a folder.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <AccountTree sx={{ mr: 1 }} />
        ASCII Tree View
      </Typography>
      <Box
        component="pre"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          lineHeight: 1.2,
          overflow: "auto",
          maxHeight: "400px",
          backgroundColor: "background.default",
          p: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {asciiTree}
      </Box>
    </Paper>
  );
}

export default AsciiTree;

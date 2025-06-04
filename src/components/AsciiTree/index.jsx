import { Paper, Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import { AccountTree, ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import { useTreeControls } from "./hooks/useTreeControls";
import { useTreeGeneration } from "./hooks/useTreeGeneration";
import { useTreeStats } from "./hooks/useTreeStats";
import TreeControls from "./components/TreeControls";
import StatisticsChips from "./components/StatisticsChips";
import ColorLegend from "./components/ColorLegend";
import TreeDisplay from "./components/TreeDisplay";

function AsciiTree({ asciiTree, treeData, ignoredItems = [] }) {
  const { showLines, showColors, showSizes, handleToggle } = useTreeControls();
  const [copySuccess, setCopySuccess] = useState(false);

  const enhancedTree = useTreeGeneration({
    treeData,
    asciiTree,
    ignoredItems,
    showLines,
    showColors,
    showSizes,
  });

  const stats = useTreeStats(treeData, ignoredItems);

  const handleCopyToClipboard = async () => {
    try {
      // Remove HTML tags from the enhanced tree for plain text copy
      const plainTextTree = enhancedTree.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(plainTextTree);
      setCopySuccess(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = enhancedTree.replace(/<[^>]*>/g, "");
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
    }
  };

  const handleSnackbarClose = () => {
    setCopySuccess(false);
  };

  if (!asciiTree && !treeData) {
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <AccountTree sx={{ mr: 1 }} />
          ASCII Tree View
        </Typography>

        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopy />}
          onClick={handleCopyToClipboard}
          sx={{ minWidth: "auto" }}
        >
          Copy Tree
        </Button>
      </Box>

      <TreeControls
        showLines={showLines}
        showColors={showColors}
        showSizes={showSizes}
        onToggle={handleToggle}
      />

      <StatisticsChips stats={stats} />

      <ColorLegend showColors={showColors} />

      <TreeDisplay content={enhancedTree} showColors={showColors} />

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          ASCII tree copied to clipboard!
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AsciiTree;

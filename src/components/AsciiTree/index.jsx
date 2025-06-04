import { Paper, Typography, Box } from "@mui/material";
import { AccountTree } from "@mui/icons-material";
import { useTreeControls } from "./hooks/useTreeControls";
import { useTreeGeneration } from "./hooks/useTreeGeneration";
import { useTreeStats } from "./hooks/useTreeStats";
import TreeControls from "./components/TreeControls";
import StatisticsChips from "./components/StatisticsChips";
import ColorLegend from "./components/ColorLegend";
import TreeDisplay from "./components/TreeDisplay";

function AsciiTree({ asciiTree, treeData, ignoredItems = [] }) {
  const { showLines, showColors, showSizes, handleToggle } = useTreeControls();

  const enhancedTree = useTreeGeneration({
    treeData,
    asciiTree,
    ignoredItems,
    showLines,
    showColors,
    showSizes,
  });

  const stats = useTreeStats(treeData, ignoredItems);

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
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <AccountTree sx={{ mr: 1 }} />
        ASCII Tree View
      </Typography>

      <TreeControls
        showLines={showLines}
        showColors={showColors}
        showSizes={showSizes}
        onToggle={handleToggle}
      />

      <StatisticsChips stats={stats} />

      <ColorLegend showColors={showColors} />

      <TreeDisplay content={enhancedTree} showColors={showColors} />
    </Paper>
  );
}

export default AsciiTree;

import { Box, Typography, Button, Chip, Stack, Tooltip } from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  UnfoldMore,
  UnfoldLess,
} from "@mui/icons-material";

function TreeControls({
  allFolderPathsCount,
  expandedItemsCount,
  isAllExpanded,
  isAllCollapsed,
  onExpandAll,
  onCollapseAll,
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          File Structure ({allFolderPathsCount} folders)
        </Typography>

        <Tooltip title="Expand All Folders">
          <Button
            size="small"
            variant="outlined"
            onClick={onExpandAll}
            disabled={isAllExpanded}
            startIcon={<UnfoldMore />}
            sx={{ minWidth: "auto", px: 1 }}
          >
            Expand
          </Button>
        </Tooltip>

        <Tooltip title="Collapse All Folders">
          <Button
            size="small"
            variant="outlined"
            onClick={onCollapseAll}
            disabled={isAllCollapsed}
            startIcon={<UnfoldLess />}
            sx={{ minWidth: "auto", px: 1 }}
          >
            Collapse
          </Button>
        </Tooltip>
      </Stack>

      {/* Expansion Status Indicator */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Chip
          label={`${expandedItemsCount}/${allFolderPathsCount} expanded`}
          size="small"
          variant="outlined"
          color={
            isAllExpanded ? "success" : isAllCollapsed ? "default" : "primary"
          }
          icon={
            isAllExpanded ? (
              <ExpandMore />
            ) : isAllCollapsed ? (
              <ExpandLess />
            ) : (
              <UnfoldMore />
            )
          }
        />
      </Box>
    </Box>
  );
}

export default TreeControls;

import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { Box, Typography, Divider } from "@mui/material";
import { useTreeExpansion } from "./hooks/useTreeExpansion";
import { useIgnoreItems } from "./hooks/useIgnoreItems";
import TreeControls from "./components/TreeControls";
import IgnoredItemsSection from "./components/IgnoredItemsSection";
import TreeItemRenderer from "./components/TreeItemRenderer";

function FileTreeViewer({ treeData, onIgnoreChange }) {
  const {
    expandedItems,
    allFolderPaths,
    handleExpandedItemsChange,
    handleExpandAll,
    handleCollapseAll,
    isAllExpanded,
    isAllCollapsed,
  } = useTreeExpansion(treeData);

  const {
    ignoredItems,
    handleIgnoreToggle,
    handleClearAllIgnored,
    isItemIgnored,
  } = useIgnoreItems(onIgnoreChange);

  if (!treeData || Object.keys(treeData).length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No files to display. Please select a folder.
      </Typography>
    );
  }

  return (
    <Box>
      <TreeControls
        allFolderPathsCount={allFolderPaths.length}
        expandedItemsCount={expandedItems.length}
        isAllExpanded={isAllExpanded}
        isAllCollapsed={isAllCollapsed}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />

      <Divider sx={{ mb: 2 }} />

      <IgnoredItemsSection
        ignoredItems={ignoredItems}
        onClearAll={handleClearAllIgnored}
        onRemoveItem={handleIgnoreToggle}
      />

      <SimpleTreeView
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
      >
        <TreeItemRenderer
          nodes={treeData}
          onIgnoreToggle={handleIgnoreToggle}
          isItemIgnored={isItemIgnored}
        />
      </SimpleTreeView>
    </Box>
  );
}

export default FileTreeViewer;

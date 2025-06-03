import { useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Folder, InsertDriveFile } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

function FileTreeViewer({ treeData }) {
  const [expandedItems, setExpandedItems] = useState([]);

  const handleExpandedItemsChange = (event, itemIds) => {
    setExpandedItems(itemIds);
  };

  const renderTreeItems = (nodes, path = "") => {
    return Object.entries(nodes).map(([key, value]) => {
      const itemId = path ? `${path}/${key}` : key;
      const isFile = value && value.name;

      return (
        <TreeItem
          key={itemId}
          itemId={itemId}
          label={
            <Box sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
              {isFile ? (
                <InsertDriveFile sx={{ mr: 1, fontSize: 16 }} />
              ) : (
                <Folder sx={{ mr: 1, fontSize: 16 }} />
              )}
              <Typography variant="body2">
                {key}
                {isFile && value.lines > 0 && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ ml: 1, opacity: 0.7 }}
                  >
                    ({value.lines} lines)
                  </Typography>
                )}
              </Typography>
            </Box>
          }
        >
          {!isFile && renderTreeItems(value, itemId)}
        </TreeItem>
      );
    });
  };

  if (!treeData || Object.keys(treeData).length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No files to display. Please select a folder.
      </Typography>
    );
  }

  return (
    <SimpleTreeView
      expandedItems={expandedItems}
      onExpandedItemsChange={handleExpandedItemsChange}
    >
      {renderTreeItems(treeData)}
    </SimpleTreeView>
  );
}

export default FileTreeViewer;

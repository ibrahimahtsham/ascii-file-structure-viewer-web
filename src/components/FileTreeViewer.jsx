import { useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import {
  ExpandMore,
  ChevronRight,
  Folder,
  InsertDriveFile,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

function FileTreeViewer({ treeData }) {
  const [expanded, setExpanded] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const renderTree = (nodes, path = "") => {
    return Object.entries(nodes).map(([key, value]) => {
      const nodeId = path ? `${path}/${key}` : key;
      const isFile = value && value.name;

      return (
        <TreeItem
          key={nodeId}
          nodeId={nodeId}
          label={
            <Box sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
              {isFile ? (
                <InsertDriveFile sx={{ mr: 1 }} />
              ) : (
                <Folder sx={{ mr: 1 }} />
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
          {!isFile && renderTree(value, nodeId)}
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
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      expanded={expanded}
      onNodeToggle={handleToggle}
    >
      {renderTree(treeData)}
    </TreeView>
  );
}

export default FileTreeViewer;

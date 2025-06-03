import { useState, useCallback, useMemo } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import {
  Folder,
  InsertDriveFile,
  VisibilityOff,
  Visibility,
  FolderOff,
  ExpandMore,
  ExpandLess,
  UnfoldMore,
  UnfoldLess,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Button,
  Divider,
} from "@mui/material";

function FileTreeViewer({ treeData, onIgnoreChange }) {
  const [expandedItems, setExpandedItems] = useState([]);
  const [ignoredItems, setIgnoredItems] = useState(new Set());

  // Get all folder paths for expand/collapse all functionality
  const allFolderPaths = useMemo(() => {
    const folders = [];

    const collectFolders = (nodes, path = "") => {
      Object.entries(nodes).forEach(([key, value]) => {
        const itemId = path ? `${path}/${key}` : key;
        const isFile = value && value.name;

        if (!isFile) {
          folders.push(itemId);
          collectFolders(value, itemId);
        }
      });
    };

    if (treeData) {
      collectFolders(treeData);
    }

    return folders;
  }, [treeData]);

  const handleExpandedItemsChange = (event, itemIds) => {
    setExpandedItems(itemIds);
  };

  const handleExpandAll = () => {
    setExpandedItems(allFolderPaths);
  };

  const handleCollapseAll = () => {
    setExpandedItems([]);
  };

  const handleIgnoreToggle = useCallback(
    (itemPath) => {
      setIgnoredItems((prev) => {
        const newIgnored = new Set(prev);
        if (newIgnored.has(itemPath)) {
          newIgnored.delete(itemPath);
        } else {
          newIgnored.add(itemPath);
        }

        // Notify parent component about the change
        if (onIgnoreChange) {
          onIgnoreChange(Array.from(newIgnored));
        }

        return newIgnored;
      });
    },
    [onIgnoreChange]
  );

  const handleClearAllIgnored = () => {
    setIgnoredItems(new Set());
    if (onIgnoreChange) {
      onIgnoreChange([]);
    }
  };

  const isItemIgnored = (itemPath) => {
    // Check if the item itself is ignored
    if (ignoredItems.has(itemPath)) return true;

    // Check if any parent folder is ignored
    return Array.from(ignoredItems).some(
      (ignoredPath) =>
        itemPath.startsWith(ignoredPath + "/") && !ignoredPath.includes(".")
    );
  };

  const getFileIcon = (extension) => {
    const iconMap = {
      ".js": "📄",
      ".jsx": "⚛️",
      ".ts": "📘",
      ".tsx": "⚛️",
      ".py": "🐍",
      ".java": "☕",
      ".cpp": "⚙️",
      ".c": "⚙️",
      ".html": "🌐",
      ".css": "🎨",
      ".scss": "🎨",
      ".json": "📋",
      ".md": "📝",
      ".txt": "📄",
      ".xml": "📄",
      ".php": "🐘",
      ".rb": "💎",
      ".go": "🐹",
      ".rs": "🦀",
      ".swift": "🐦",
      ".kt": "🎯",
      ".dart": "🎯",
      ".vue": "💚",
      ".svelte": "🧡",
    };
    return iconMap[extension] || "📄";
  };

  const renderTreeItems = (nodes, path = "") => {
    return Object.entries(nodes).map(([key, value]) => {
      const itemId = path ? `${path}/${key}` : key;
      const isFile = value && value.name;
      const isIgnored = isItemIgnored(itemId);
      const extension = isFile ? value.extension : null;

      return (
        <TreeItem
          key={itemId}
          itemId={itemId}
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                py: 0.5,
                opacity: isIgnored ? 0.5 : 1,
                textDecoration: isIgnored ? "line-through" : "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                {isFile ? (
                  <Box sx={{ mr: 1, fontSize: 16 }}>
                    {getFileIcon(extension)}
                  </Box>
                ) : (
                  <Folder
                    sx={{
                      mr: 1,
                      fontSize: 16,
                      color: isIgnored ? "text.disabled" : "warning.main",
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isIgnored ? "text.disabled" : "text.primary",
                  }}
                >
                  {key}
                  {isFile && value.lines > 0 && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        ml: 1,
                        opacity: 0.7,
                        color:
                          value.lines > 1000
                            ? "error.main"
                            : value.lines > 500
                            ? "warning.main"
                            : value.lines > 100
                            ? "info.main"
                            : "success.main",
                      }}
                    >
                      ({value.lines} lines)
                    </Typography>
                  )}
                  {isFile && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ ml: 1, opacity: 0.6 }}
                    >
                      ({(value.size / 1024).toFixed(1)} KB)
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Tooltip
                title={
                  isIgnored
                    ? "Include in ASCII tree"
                    : "Exclude from ASCII tree"
                }
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIgnoreToggle(itemId, isFile);
                  }}
                  sx={{
                    ml: 1,
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {isIgnored ? (
                    isFile ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <FolderOff fontSize="small" />
                    )
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
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

  const isAllExpanded = expandedItems.length === allFolderPaths.length;
  const isAllCollapsed = expandedItems.length === 0;

  return (
    <Box>
      {/* Tree Controls */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            File Structure ({allFolderPaths.length} folders)
          </Typography>

          <Tooltip title="Expand All Folders">
            <Button
              size="small"
              variant="outlined"
              onClick={handleExpandAll}
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
              onClick={handleCollapseAll}
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
            label={`${expandedItems.length}/${allFolderPaths.length} expanded`}
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

        <Divider />
      </Box>

      {/* Ignored Items Section */}
      {ignoredItems.size > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Ignored items ({ignoredItems.size}):
            </Typography>
            <Button
              size="small"
              onClick={handleClearAllIgnored}
              variant="outlined"
              color="secondary"
            >
              Clear All
            </Button>
          </Stack>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {Array.from(ignoredItems)
              .slice(0, 5)
              .map((item) => (
                <Chip
                  key={item}
                  label={item.split("/").pop()}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onDelete={() => handleIgnoreToggle(item)}
                />
              ))}
            {ignoredItems.size > 5 && (
              <Chip
                label={`+${ignoredItems.size - 5} more`}
                size="small"
                variant="outlined"
                color="secondary"
              />
            )}
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Tree View */}
      <SimpleTreeView
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
      >
        {renderTreeItems(treeData)}
      </SimpleTreeView>
    </Box>
  );
}

export default FileTreeViewer;

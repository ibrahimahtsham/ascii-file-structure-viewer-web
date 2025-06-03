import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Search,
  Folder,
  InsertDriveFile,
  ExpandMore,
  CheckBox,
  CheckBoxOutlineBlank,
  FilterList,
} from "@mui/icons-material";

// Debounce hook for search input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function FileSelectionModal({
  open,
  onClose,
  files,
  onConfirm,
  defaultIgnorePatterns = [
    "node_modules/",
    ".git/",
    "dist/",
    "build/",
    ".vscode/",
    "__pycache__/",
    ".next/",
    "coverage/",
    ".gitignore",
    "eslint.config.js",
    "package-lock.json",
    "package.json",
  ],
}) {
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [searchInput, setSearchInput] = useState(""); // Immediate input state
  const [ignorePatterns, setIgnorePatterns] = useState(defaultIgnorePatterns);
  const [newPattern, setNewPattern] = useState("");

  // Debounce search input to reduce computation frequency
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  // Memoize file tree construction (only when files change)
  const fileTree = useMemo(() => {
    if (!files || files.length === 0) return {};

    const tree = {};
    files.forEach((file) => {
      const parts = file.webkitRelativePath.split("/");
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          if (index === parts.length - 1) {
            // It's a file
            current[part] = {
              type: "file",
              file: file,
              path: file.webkitRelativePath,
              size: file.size,
            };
          } else {
            // It's a folder
            current[part] = {
              type: "folder",
              children: {},
              path: parts.slice(0, index + 1).join("/"),
            };
          }
        }
        current = current[part].children || current[part];
      });
    });
    return tree;
  }, [files]);

  // Memoize file filtering with debounced search
  const filteredFiles = useMemo(() => {
    if (!files || files.length === 0) return [];

    return files.filter((file) => {
      const path = file.webkitRelativePath.toLowerCase();
      const matchesSearch =
        !debouncedSearchTerm ||
        path.includes(debouncedSearchTerm.toLowerCase());
      const matchesIgnorePattern = ignorePatterns.some((pattern) =>
        path.includes(pattern.toLowerCase())
      );
      return matchesSearch && !matchesIgnorePattern;
    });
  }, [files, debouncedSearchTerm, ignorePatterns]);

  // Initialize selected files when filteredFiles changes
  useEffect(() => {
    if (filteredFiles.length > 0) {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.webkitRelativePath)));
    }
  }, [filteredFiles]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleFileToggle = useCallback((filePath) => {
    setSelectedFiles((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(filePath)) {
        newSelected.delete(filePath);
      } else {
        newSelected.add(filePath);
      }
      return newSelected;
    });
  }, []);

  const handleFolderToggle = useCallback(
    (folderPath, shouldSelect) => {
      setSelectedFiles((prev) => {
        const newSelected = new Set(prev);
        filteredFiles.forEach((file) => {
          if (file.webkitRelativePath.startsWith(folderPath + "/")) {
            if (shouldSelect) {
              newSelected.add(file.webkitRelativePath);
            } else {
              newSelected.delete(file.webkitRelativePath);
            }
          }
        });
        return newSelected;
      });
    },
    [filteredFiles]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedFiles(new Set(filteredFiles.map((f) => f.webkitRelativePath)));
  }, [filteredFiles]);

  const handleDeselectAll = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  const handleAddPattern = useCallback(() => {
    if (newPattern.trim() && !ignorePatterns.includes(newPattern.trim())) {
      setIgnorePatterns((prev) => [...prev, newPattern.trim()]);
      setNewPattern("");
    }
  }, [newPattern, ignorePatterns]);

  const handleRemovePattern = useCallback((pattern) => {
    setIgnorePatterns((prev) => prev.filter((p) => p !== pattern));
  }, []);

  const handleConfirm = useCallback(() => {
    const selectedFilesList = files.filter((file) =>
      selectedFiles.has(file.webkitRelativePath)
    );
    onConfirm(selectedFilesList, ignorePatterns);
  }, [files, selectedFiles, ignorePatterns, onConfirm]);

  // Memoize tree rendering to prevent unnecessary re-renders
  const renderTreeItem = useCallback(
    (key, item, level = 0) => {
      if (item.type === "file") {
        const isSelected = selectedFiles.has(item.path);
        const isFiltered = filteredFiles.some(
          (f) => f.webkitRelativePath === item.path
        );

        if (!isFiltered) return null;

        return (
          <ListItem key={item.path} sx={{ pl: level * 2 + 1 }}>
            <ListItemButton onClick={() => handleFileToggle(item.path)}>
              <ListItemIcon>
                <Checkbox checked={isSelected} size="small" />
              </ListItemIcon>
              <ListItemIcon>
                <InsertDriveFile sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText
                primary={key}
                secondary={`${(item.size / 1024).toFixed(1)} KB`}
                primaryTypographyProps={{ variant: "body2" }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItemButton>
          </ListItem>
        );
      } else {
        // Folder
        const folderFiles = filteredFiles.filter((f) =>
          f.webkitRelativePath.startsWith(item.path + "/")
        );
        const selectedInFolder = folderFiles.filter((f) =>
          selectedFiles.has(f.webkitRelativePath)
        ).length;
        const isAllSelected =
          folderFiles.length > 0 && selectedInFolder === folderFiles.length;
        const isPartiallySelected =
          selectedInFolder > 0 && selectedInFolder < folderFiles.length;

        if (folderFiles.length === 0) return null;

        return (
          <Box key={item.path}>
            <ListItem sx={{ pl: level * 2 }}>
              <ListItemButton
                onClick={() => handleFolderToggle(item.path, !isAllSelected)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemIcon>
                  <Folder sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary={key}
                  secondary={`${folderFiles.length} files`}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItemButton>
            </ListItem>
            {Object.entries(item.children || {}).map(([childKey, childItem]) =>
              renderTreeItem(childKey, childItem, level + 1)
            )}
          </Box>
        );
      }
    },
    [selectedFiles, filteredFiles, handleFileToggle, handleFolderToggle]
  );

  // Memoize the rendered tree items
  const treeItems = useMemo(() => {
    return Object.entries(fileTree).map(([key, item]) =>
      renderTreeItem(key, item)
    );
  }, [fileTree, renderTreeItem]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Select Files to Process</Typography>
          <Box>
            <Button
              startIcon={<CheckBox />}
              onClick={handleSelectAll}
              size="small"
              sx={{ mr: 1 }}
            >
              All
            </Button>
            <Button
              startIcon={<CheckBoxOutlineBlank />}
              onClick={handleDeselectAll}
              size="small"
            >
              None
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search files and folders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Ignore Patterns Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FilterList sx={{ mr: 1 }} />
              <Typography variant="subtitle2">
                Ignore Patterns ({ignorePatterns.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add ignore pattern (e.g., *.log, temp/)"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddPattern()}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={handleAddPattern}
                      disabled={!newPattern.trim()}
                    >
                      Add
                    </Button>
                  ),
                }}
              />
            </Box>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {ignorePatterns.map((pattern) => (
                <Chip
                  key={pattern}
                  label={pattern}
                  size="small"
                  onDelete={() => handleRemovePattern(pattern)}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Statistics */}
        <Box
          sx={{ mb: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}
        >
          <Typography variant="body2">
            <strong>Selected:</strong> {selectedFiles.size} of{" "}
            {filteredFiles.length} files (
            {filteredFiles.length > 0
              ? ((selectedFiles.size / filteredFiles.length) * 100).toFixed(1)
              : 0}
            %)
          </Typography>
        </Box>

        {/* File Tree */}
        <Box
          sx={{
            maxHeight: 400,
            overflow: "auto",
            border: 1,
            borderColor: "divider",
          }}
        >
          <List dense>{treeItems}</List>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedFiles.size === 0}
        >
          Process {selectedFiles.size} Files
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FileSelectionModal;

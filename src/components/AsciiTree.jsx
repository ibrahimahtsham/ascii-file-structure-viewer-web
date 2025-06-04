import { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { AccountTree, Code, Visibility, Palette } from "@mui/icons-material";

function AsciiTree({ asciiTree, treeData, ignoredItems = [] }) {
  const [showLines, setShowLines] = useState(false);
  const [showColors, setShowColors] = useState(true);
  const [showSizes, setShowSizes] = useState(false);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const getFileColorClass = (lines) => {
    if (lines === 0) return "file-empty";
    if (lines >= 1 && lines <= 200) return "file-small";
    if (lines >= 201 && lines <= 300) return "file-medium";
    if (lines >= 301 && lines <= 500) return "file-large";
    if (lines > 500) return "file-huge";
    return "file-small"; // fallback
  };

  const generateEnhancedAsciiTree = useMemo(() => {
    if (!treeData) {
      return asciiTree;
    }

    const isIgnored = (path) => {
      return (
        ignoredItems.includes(path) ||
        ignoredItems.some(
          (ignoredPath) =>
            path.startsWith(ignoredPath + "/") && !ignoredPath.includes(".")
        )
      );
    };

    const renderNode = (node, prefix = "", currentPath = "") => {
      let result = "";
      const entries = Object.entries(node).filter(([key]) => {
        const itemPath = currentPath ? `${currentPath}/${key}` : key;
        return !isIgnored(itemPath);
      });

      entries.forEach(([key, value], index) => {
        const isLastEntry = index === entries.length - 1;
        const connector = isLastEntry ? "└── " : "├── ";
        const itemPath = currentPath ? `${currentPath}/${key}` : key;
        const isFile = value && value.name;

        let displayText = key;

        if (showLines && isFile && value.lines > 0) {
          displayText += ` (${value.lines} lines)`;
        }

        if (showSizes && isFile) {
          displayText += ` [${formatBytes(value.size)}]`;
        }

        let lineOutput;
        if (showColors && isFile) {
          const colorClass = getFileColorClass(value.lines);
          lineOutput = `${prefix}${connector}<span class="${colorClass}">📄 ${displayText}</span>\n`;
        } else if (showColors && !isFile) {
          lineOutput = `${prefix}${connector}<span class="folder">📁 ${displayText}</span>\n`;
        } else {
          const icon = isFile ? "📄" : "📁";
          lineOutput = `${prefix}${connector}${icon} ${displayText}\n`;
        }

        result += lineOutput;

        if (!isFile && typeof value === "object") {
          const nextPrefix = prefix + (isLastEntry ? "    " : "│   ");
          result += renderNode(value, nextPrefix, itemPath);
        }
      });

      return result;
    };

    return renderNode(treeData);
  }, [treeData, ignoredItems, showLines, showColors, showSizes, asciiTree]);

  const getStats = useMemo(() => {
    if (!treeData)
      return {
        totalFiles: 0,
        totalFolders: 0,
        ignoredCount: ignoredItems.length,
      };

    const countItems = (node, currentPath = "") => {
      let files = 0;
      let folders = 0;

      Object.entries(node).forEach(([key, value]) => {
        const itemPath = currentPath ? `${currentPath}/${key}` : key;
        const isIgnored =
          ignoredItems.includes(itemPath) ||
          ignoredItems.some(
            (ignored) =>
              itemPath.startsWith(ignored + "/") && !ignored.includes(".")
          );

        if (!isIgnored) {
          if (value && value.name) {
            files++;
          } else {
            folders++;
            const childCounts = countItems(value, itemPath);
            files += childCounts.files;
            folders += childCounts.folders;
          }
        }
      });

      return { files, folders };
    };

    const counts = countItems(treeData);
    return {
      totalFiles: counts.files,
      totalFolders: counts.folders,
      ignoredCount: ignoredItems.length,
    };
  }, [treeData, ignoredItems]);

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

      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
        <FormControlLabel
          control={
            <Switch
              checked={showLines}
              onChange={(e) => setShowLines(e.target.checked)}
              size="small"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Code sx={{ mr: 0.5, fontSize: 16 }} />
              Lines
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={showColors}
              onChange={(e) => setShowColors(e.target.checked)}
              size="small"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Palette sx={{ mr: 0.5, fontSize: 16 }} />
              Colors
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={showSizes}
              onChange={(e) => setShowSizes(e.target.checked)}
              size="small"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Visibility sx={{ mr: 0.5, fontSize: 16 }} />
              Sizes
            </Box>
          }
        />
      </Stack>

      {/* Statistics */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          label={`${getStats.totalFiles} files`}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`${getStats.totalFolders} folders`}
          size="small"
          color="secondary"
          variant="outlined"
        />
        {getStats.ignoredCount > 0 && (
          <Chip
            label={`${getStats.ignoredCount} ignored`}
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
      </Stack>

      {/* Color Legend */}
      {showColors && (
        <Box
          sx={{ mb: 2, p: 1, bgcolor: "background.default", borderRadius: 1 }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, mb: 1, display: "block" }}
          >
            Color Legend:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Tooltip title="Folders">
              <Chip
                label="📁 Folders"
                size="small"
                sx={{ color: "#FFA726", borderColor: "#FFA726" }}
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title="Empty files (0 lines)">
              <Chip
                label="📄 Empty"
                size="small"
                sx={{ color: "#9E9E9E", borderColor: "#9E9E9E" }}
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title="Small files (1-200 lines)">
              <Chip
                label="📄 Small"
                size="small"
                sx={{ color: "#4CAF50", borderColor: "#4CAF50" }}
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title="Medium files (201-300 lines)">
              <Chip
                label="📄 Medium"
                size="small"
                sx={{ color: "#2196F3", borderColor: "#2196F3" }}
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title="Large files (301-500 lines)">
              <Chip
                label="📄 Large"
                size="small"
                sx={{ color: "#FF9800", borderColor: "#FF9800" }}
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title="Huge files (500+ lines)">
              <Chip
                label="📄 Huge"
                size="small"
                sx={{ color: "#F44336", borderColor: "#F44336" }}
                variant="outlined"
              />
            </Tooltip>
          </Stack>
        </Box>
      )}

      {/* ASCII Tree Display */}
      <Box
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          lineHeight: 1.3,
          overflow: "auto",
          maxHeight: "500px",
          backgroundColor: "background.default",
          p: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          "& .folder": {
            color: showColors ? "#FFA726" : "inherit",
          },
          "& .file-empty": {
            color: showColors ? "#9E9E9E" : "inherit",
          },
          "& .file-small": {
            color: showColors ? "#4CAF50" : "inherit",
          },
          "& .file-medium": {
            color: showColors ? "#2196F3" : "inherit",
          },
          "& .file-large": {
            color: showColors ? "#FF9800" : "inherit",
          },
          "& .file-huge": {
            color: showColors ? "#F44336" : "inherit",
          },
        }}
        dangerouslySetInnerHTML={{
          __html: generateEnhancedAsciiTree || asciiTree,
        }}
      />
    </Paper>
  );
}

export default AsciiTree;

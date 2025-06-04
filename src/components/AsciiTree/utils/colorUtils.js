export const getFileColorClass = (lines) => {
  if (lines === 0) return "file-empty";
  if (lines >= 1 && lines <= 200) return "file-small";
  if (lines >= 201 && lines <= 300) return "file-medium";
  if (lines >= 301 && lines <= 500) return "file-large";
  if (lines > 500) return "file-huge";
  return "file-small"; // fallback
};

export const COLOR_LEGEND_CONFIG = [
  {
    type: "folder",
    label: "📁 Folders",
    tooltip: "Folders",
    color: "#FFA726",
  },
  {
    type: "empty",
    label: "📄 Empty",
    tooltip: "Empty files (0 lines)",
    color: "#9E9E9E",
  },
  {
    type: "small",
    label: "📄 Small",
    tooltip: "Small files (1-200 lines)",
    color: "#4CAF50",
  },
  {
    type: "medium",
    label: "📄 Medium",
    tooltip: "Medium files (201-300 lines)",
    color: "#2196F3",
  },
  {
    type: "large",
    label: "📄 Large",
    tooltip: "Large files (301-500 lines)",
    color: "#FF9800",
  },
  {
    type: "huge",
    label: "📄 Huge",
    tooltip: "Huge files (500+ lines)",
    color: "#F44336",
  },
];

export const TREE_STYLES = (showColors) => ({
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
});

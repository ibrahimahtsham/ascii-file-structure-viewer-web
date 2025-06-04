import { Box, List } from "@mui/material";
import { useFileTreeRenderer } from "../hooks/useFileTreeRenderer";

function FileTreeSection({
  fileTree,
  selectedFiles,
  filteredFiles,
  onFileToggle,
  onFolderToggle,
}) {
  const { renderTreeItems } = useFileTreeRenderer(
    selectedFiles,
    filteredFiles,
    onFileToggle,
    onFolderToggle
  );

  return (
    <Box
      sx={{
        maxHeight: 400,
        overflow: "auto",
        border: 1,
        borderColor: "divider",
      }}
    >
      <List dense>
        {Object.entries(fileTree).map(([key, item]) =>
          renderTreeItems(key, item, 0)
        )}
      </List>
    </Box>
  );
}

export default FileTreeSection;

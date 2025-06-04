import { useCallback } from "react";
import { Box } from "@mui/material";
import TreeItem from "../components/TreeItem";

export function useFileTreeRenderer(
  selectedFiles,
  filteredFiles,
  onFileToggle,
  onFolderToggle
) {
  const renderTreeItems = useCallback(
    (key, item, level = 0) => {
      if (item.type === "file") {
        const isSelected = selectedFiles.has(item.path);
        const isFiltered = filteredFiles.some(
          (f) => f.webkitRelativePath === item.path
        );

        if (!isFiltered) return null;

        return (
          <TreeItem
            key={item.path}
            itemKey={key}
            item={item}
            level={level}
            isSelected={isSelected}
            onToggle={() => onFileToggle(item.path)}
          />
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
            <TreeItem
              itemKey={key}
              item={item}
              level={level}
              isAllSelected={isAllSelected}
              isPartiallySelected={isPartiallySelected}
              folderFileCount={folderFiles.length}
              onToggle={() => onFolderToggle(item.path, !isAllSelected)}
            />
            {Object.entries(item.children || {}).map(([childKey, childItem]) =>
              renderTreeItems(childKey, childItem, level + 1)
            )}
          </Box>
        );
      }
    },
    [selectedFiles, filteredFiles, onFileToggle, onFolderToggle]
  );

  return { renderTreeItems };
}

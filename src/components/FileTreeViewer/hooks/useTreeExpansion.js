import { useState, useMemo } from "react";

export function useTreeExpansion(treeData) {
  const [expandedItems, setExpandedItems] = useState([]);

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

  const isAllExpanded = expandedItems.length === allFolderPaths.length;
  const isAllCollapsed = expandedItems.length === 0;

  return {
    expandedItems,
    allFolderPaths,
    handleExpandedItemsChange,
    handleExpandAll,
    handleCollapseAll,
    isAllExpanded,
    isAllCollapsed,
  };
}

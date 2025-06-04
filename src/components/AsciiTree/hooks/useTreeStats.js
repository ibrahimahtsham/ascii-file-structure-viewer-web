import { useMemo } from "react";

export function useTreeStats(treeData, ignoredItems) {
  return useMemo(() => {
    if (!treeData) {
      return {
        totalFiles: 0,
        totalFolders: 0,
        ignoredCount: ignoredItems.length,
      };
    }

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
}

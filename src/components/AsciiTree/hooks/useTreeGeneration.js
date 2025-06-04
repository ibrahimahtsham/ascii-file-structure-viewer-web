import { useMemo } from "react";
import { renderTreeNode } from "../utils/treeRenderer";

export function useTreeGeneration({
  treeData,
  asciiTree,
  ignoredItems,
  showLines,
  showColors,
  showSizes,
}) {
  return useMemo(() => {
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

    return renderTreeNode(treeData, {
      isIgnored,
      showLines,
      showColors,
      showSizes,
    });
  }, [treeData, ignoredItems, showLines, showColors, showSizes, asciiTree]);
}

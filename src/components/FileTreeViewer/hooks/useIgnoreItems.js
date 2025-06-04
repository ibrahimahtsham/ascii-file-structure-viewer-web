import { useState, useCallback, useEffect } from "react";

export function useIgnoreItems(onIgnoreChange) {
  const [ignoredItems, setIgnoredItems] = useState(new Set());

  // Use useEffect to call onIgnoreChange when ignoredItems changes
  useEffect(() => {
    if (onIgnoreChange) {
      onIgnoreChange(Array.from(ignoredItems));
    }
  }, [ignoredItems, onIgnoreChange]);

  const handleIgnoreToggle = useCallback((itemPath) => {
    setIgnoredItems((prev) => {
      const newIgnored = new Set(prev);
      if (newIgnored.has(itemPath)) {
        newIgnored.delete(itemPath);
      } else {
        newIgnored.add(itemPath);
      }
      return newIgnored;
    });
  }, []);

  const handleClearAllIgnored = () => {
    setIgnoredItems(new Set());
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

  return {
    ignoredItems,
    handleIgnoreToggle,
    handleClearAllIgnored,
    isItemIgnored,
  };
}

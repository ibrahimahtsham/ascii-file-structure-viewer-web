import { useState, useCallback } from "react";

export function useIgnoreItems(onIgnoreChange) {
  const [ignoredItems, setIgnoredItems] = useState(new Set());

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

  return {
    ignoredItems,
    handleIgnoreToggle,
    handleClearAllIgnored,
    isItemIgnored,
  };
}

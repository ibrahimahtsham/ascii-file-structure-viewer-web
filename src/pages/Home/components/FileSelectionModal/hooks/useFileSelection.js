import { useState, useMemo, useCallback, useEffect } from "react";

export function useFileSelection(files, searchTerm, ignorePatterns) {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // Memoize file filtering
  const filteredFiles = useMemo(() => {
    if (!files || files.length === 0) return [];

    return files.filter((file) => {
      const path = file.webkitRelativePath.toLowerCase();
      const matchesSearch =
        !searchTerm || path.includes(searchTerm.toLowerCase());
      const matchesIgnorePattern = ignorePatterns.some((pattern) =>
        path.includes(pattern.toLowerCase())
      );
      return matchesSearch && !matchesIgnorePattern;
    });
  }, [files, searchTerm, ignorePatterns]);

  // Initialize selected files when filteredFiles changes
  useEffect(() => {
    if (filteredFiles.length > 0) {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.webkitRelativePath)));
    }
  }, [filteredFiles]);

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

  return {
    selectedFiles,
    filteredFiles,
    handleFileToggle,
    handleFolderToggle,
    handleSelectAll,
    handleDeselectAll,
  };
}

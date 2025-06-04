import { useState, useCallback } from "react";

export function useIgnorePatterns(defaultPatterns) {
  const [ignorePatterns, setIgnorePatterns] = useState(defaultPatterns);

  const addPattern = useCallback(
    (pattern) => {
      if (pattern.trim() && !ignorePatterns.includes(pattern.trim())) {
        setIgnorePatterns((prev) => [...prev, pattern.trim()]);
        return true;
      }
      return false;
    },
    [ignorePatterns]
  );

  const removePattern = useCallback((pattern) => {
    setIgnorePatterns((prev) => prev.filter((p) => p !== pattern));
  }, []);

  return {
    ignorePatterns,
    addPattern,
    removePattern,
  };
}

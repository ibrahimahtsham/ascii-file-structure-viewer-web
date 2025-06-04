import { useState, useCallback } from "react";

export function useTreeControls() {
  const [showLines, setShowLines] = useState(false);
  const [showColors, setShowColors] = useState(true);
  const [showSizes, setShowSizes] = useState(false);

  const handleToggle = useCallback((controlType) => {
    switch (controlType) {
      case "lines":
        setShowLines((prev) => !prev);
        break;
      case "colors":
        setShowColors((prev) => !prev);
        break;
      case "sizes":
        setShowSizes((prev) => !prev);
        break;
      default:
        break;
    }
  }, []);

  return {
    showLines,
    showColors,
    showSizes,
    handleToggle,
  };
}

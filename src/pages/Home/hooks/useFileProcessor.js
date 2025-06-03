import { useState, useCallback, useRef } from "react";
import { FileProcessor } from "../../../utils/fileProcessor";
import { UI_UPDATE_DELAY } from "../utils/constants";

export const useFileProcessor = () => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    percent: 0,
    current: 0,
    total: 0,
    phaseTimings: {
      filtering: 0,
      processing: 0,
      building: 0,
      ascii: 0,
    },
  });
  const [debugLogs, setDebugLogs] = useState([]);
  const fileInputRef = useRef(null);

  const addDebugLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const processFiles = useCallback(
    async (files) => {
      if (files.length === 0) return;

      // Clear previous data immediately
      setFileData(null);
      setLoading(true);
      setError(null);
      setDebugLogs([]);
      setProgress({
        percent: 0,
        current: 0,
        total: files.length,
        phaseTimings: { filtering: 0, processing: 0, building: 0, ascii: 0 },
      });

      // Add first debug log immediately and force UI update
      addDebugLog(`🎯 User selected folder with ${files.length} files`);

      // Force React to update the UI immediately
      await new Promise((resolve) => setTimeout(resolve, UI_UPDATE_DELAY));

      try {
        const fileProcessor = new FileProcessor();
        const result = await fileProcessor.processFiles(
          files,
          (percent, current, total, phaseTimings) => {
            setProgress({
              percent: Math.round(percent),
              current,
              total,
              phaseTimings,
            });
          },
          addDebugLog
        );

        addDebugLog("🎉 Processing completed successfully!");
        setFileData(result);
      } catch (err) {
        const errorMessage = "Error processing files: " + err.message;
        setError(errorMessage);
        addDebugLog(`❌ ${errorMessage}`);
        console.error("File processing error:", err);
      } finally {
        setLoading(false);
        setProgress((prev) => ({ ...prev, percent: 0, current: 0, total: 0 }));

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [addDebugLog]
  );

  const handleFolderSelect = useCallback(
    async (event) => {
      const files = Array.from(event.target.files);
      await processFiles(files);
    },
    [processFiles]
  );

  return {
    fileData,
    loading,
    error,
    progress,
    debugLogs,
    fileInputRef,
    handleFolderSelect,
  };
};

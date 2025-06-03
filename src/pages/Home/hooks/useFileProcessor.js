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
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const addDebugLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const processFiles = useCallback(
    async (files, customIgnorePatterns = []) => {
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
      addDebugLog(`🎯 User selected ${files.length} files for processing`);
      if (customIgnorePatterns.length > 0) {
        addDebugLog(
          `🚫 Using custom ignore patterns: ${customIgnorePatterns.join(", ")}`
        );
      }

      // Force React to update the UI immediately
      await new Promise((resolve) => setTimeout(resolve, UI_UPDATE_DELAY));

      try {
        const fileProcessor = new FileProcessor();

        // Set custom ignore patterns if provided
        if (customIgnorePatterns.length > 0) {
          fileProcessor.setCustomIgnorePatterns(customIgnorePatterns);
        }

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

  const handleFolderSelect = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Show selection modal instead of processing immediately
    setPendingFiles(files);
    setShowSelectionModal(true);
  }, []);

  const handleSelectionConfirm = useCallback(
    async (selectedFiles, ignorePatterns) => {
      setShowSelectionModal(false);
      setPendingFiles([]);
      await processFiles(selectedFiles, ignorePatterns);
    },
    [processFiles]
  );

  const handleSelectionCancel = useCallback(() => {
    setShowSelectionModal(false);
    setPendingFiles([]);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    fileData,
    loading,
    error,
    progress,
    debugLogs,
    fileInputRef,
    showSelectionModal,
    pendingFiles,
    handleFolderSelect,
    handleSelectionConfirm,
    handleSelectionCancel,
  };
};

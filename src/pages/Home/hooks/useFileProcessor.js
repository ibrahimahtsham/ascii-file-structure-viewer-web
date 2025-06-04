import { useState, useCallback, useRef } from "react";
import { FileProcessor } from "../../../utils/fileProcessor";
import { GitHubAPI } from "../utils/github/GitHubAPI";
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
  const [githubLoading, setGithubLoading] = useState(false);
  const fileInputRef = useRef(null);

  const addDebugLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const processFiles = useCallback(
    async (files, customIgnorePatterns = []) => {
      if (files.length === 0) return;

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

      addDebugLog(`🎯 Processing ${files.length} files`);
      if (customIgnorePatterns.length > 0) {
        addDebugLog(
          `🚫 Using custom ignore patterns: ${customIgnorePatterns.join(", ")}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, UI_UPDATE_DELAY));

      try {
        const fileProcessor = new FileProcessor();

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

    setPendingFiles(files);
    setShowSelectionModal(true);
  }, []);

  const handleRepositorySelect = useCallback(
    async (repoUrl) => {
      setError(null);
      setGithubLoading(true);
      setDebugLogs([]);

      addDebugLog(`🔗 Fetching repository: ${repoUrl}`);

      try {
        const githubAPI = new GitHubAPI();

        // Check rate limit first and log the info
        const rateLimitInfo = await githubAPI.checkRateLimit();
        if (rateLimitInfo) {
          const details = githubAPI.rateLimitManager.getRateLimitDetails();
          addDebugLog(
            `⏱️ GitHub API Status: ${details.remaining}/${details.limit} requests remaining`
          );

          if (!details.canProceed) {
            throw githubAPI.rateLimitManager.createRateLimitError();
          }
        }

        const { owner, repo } = githubAPI.parseRepositoryURL(repoUrl);
        addDebugLog(`📂 Analyzing ${owner}/${repo}...`);

        const files = await githubAPI.fetchAllFiles(
          owner,
          repo,
          (count, rateLimitInfo) => {
            addDebugLog(`📄 Fetched ${count} files...`);
            if (rateLimitInfo && rateLimitInfo.remaining !== null) {
              addDebugLog(
                `⏱️ Rate limit: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} requests remaining`
              );
            }
          },
          (rateLimitInfo) => {
            addDebugLog(`⚠️ Rate limit warning: ${rateLimitInfo.message}`);
          }
        );

        addDebugLog(
          `✅ Successfully fetched ${files.length} files from GitHub`
        );

        // Final rate limit check
        const finalRateLimit = githubAPI.rateLimitManager.getRateLimitDetails();
        addDebugLog(
          `⏱️ Final API Status: ${finalRateLimit.remaining}/${finalRateLimit.limit} requests remaining`
        );

        setPendingFiles(files);
        setShowSelectionModal(true);
      } catch (err) {
        let errorMessage = "Error fetching repository: " + err.message;

        // Enhanced error context
        if (err.message.includes("rate limit")) {
          addDebugLog(`❌ Rate limit error occurred`);
          // Add helpful tip about waiting
          if (err.message.includes("Try again in")) {
            addDebugLog(
              `💡 Tip: GitHub API has hourly rate limits. Consider waiting or using a personal access token for higher limits.`
            );
          }
        } else if (err.message.includes("not found")) {
          addDebugLog(
            `❌ Repository access error - check if repository exists and is public`
          );
        } else if (err.message.includes("Network error")) {
          addDebugLog(`❌ Network connectivity issue`);
        }

        setError(errorMessage);
        addDebugLog(`❌ ${errorMessage}`);
        console.error("GitHub fetch error:", err);
      } finally {
        setGithubLoading(false);
      }
    },
    [addDebugLog]
  );

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
    setGithubLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    fileData,
    loading: loading || githubLoading,
    githubLoading,
    error,
    progress,
    debugLogs,
    fileInputRef,
    showSelectionModal,
    pendingFiles,
    handleFolderSelect,
    handleRepositorySelect,
    handleSelectionConfirm,
    handleSelectionCancel,
  };
};

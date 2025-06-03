import { useState, useCallback, useRef } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Folder,
  Timer,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import FileTreeViewer from "../components/FileTreeViewer";
import CodeStats from "../components/CodeStats";
import AsciiTree from "../components/AsciiTree";
import { FileProcessor } from "../utils/fileProcessor";

function Home() {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    percent: 0,
    current: 0,
    total: 0,
  });
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const fileInputRef = useRef(null);

  const addDebugLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const handleFolderSelect = useCallback(
    async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      // Clear previous data immediately
      setFileData(null);
      setLoading(true);
      setError(null);
      setDebugLogs([]);
      setProgress({ percent: 0, current: 0, total: files.length });

      // Add first debug log immediately and force UI update
      addDebugLog(`🎯 User selected folder with ${files.length} files`);

      // Force React to update the UI immediately
      await new Promise((resolve) => setTimeout(resolve, 10));

      try {
        const fileProcessor = new FileProcessor();
        const result = await fileProcessor.processFiles(
          files,
          (percent, current, total) => {
            setProgress({ percent: Math.round(percent), current, total });
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
        setProgress({ percent: 0, current: 0, total: 0 });

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [addDebugLog]
  );

  const formatTime = (seconds) => {
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)}ms`;
    }
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          ASCII File Structure Viewer
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Upload a project folder to visualize its structure and analyze code
          statistics
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <input
            ref={fileInputRef}
            type="file"
            webkitdirectory=""
            multiple
            onChange={handleFolderSelect}
            style={{ display: "none" }}
            id="folder-input"
          />
          <label htmlFor="folder-input">
            <Button
              variant="contained"
              component="span"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <Folder />}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? "Processing..." : "Select Project Folder"}
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Choose a folder from your computer to analyze its file structure
          </Typography>

          {loading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress.percent}
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary">
                Processing {progress.current.toLocaleString()} of{" "}
                {progress.total.toLocaleString()} files ({progress.percent}%)
              </Typography>
            </Box>
          )}

          {fileData?.stats?.processingTime && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Chip
                icon={<Timer />}
                label={`Processed in ${formatTime(
                  fileData.stats.processingTime
                )}`}
                color="success"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Debug Console */}
      {debugLogs.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Debug Console ({debugLogs.length} logs)
            </Typography>
            <IconButton onClick={() => setShowDebug(!showDebug)} size="small">
              {showDebug ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={showDebug}>
            <Box
              sx={{
                maxHeight: 300,
                overflow: "auto",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.87)"
                    : "rgba(0, 0, 0, 0.87)",
                border: (theme) =>
                  `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(0, 0, 0, 0.12)"
                  }`,
                p: 1,
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.875rem",
                lineHeight: 1.4,
              }}
            >
              {debugLogs.map((log, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 0.25,
                    borderBottom:
                      index < debugLogs.length - 1
                        ? (theme) =>
                            `1px solid ${
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.08)"
                            }`
                        : "none",
                  }}
                >
                  {log}
                </Box>
              ))}
            </Box>
          </Collapse>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {fileData && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 2, height: "600px", overflow: "auto" }}>
              <Typography variant="h6" gutterBottom>
                File Structure
              </Typography>
              <FileTreeViewer treeData={fileData.structure} />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <CodeStats stats={fileData.stats} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AsciiTree asciiTree={fileData.asciiTree} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Home;

import { useState, useCallback } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloudUpload, Folder } from "@mui/icons-material";
import FileTreeViewer from "../components/FileTreeViewer";
import CodeStats from "../components/CodeStats";
import AsciiTree from "../components/AsciiTree";
import { FileProcessor } from "../utils/fileProcessor";

function Home() {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFolderSelect = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const fileProcessor = new FileProcessor();
      const result = await fileProcessor.processFiles(files);
      setFileData(result);
    } catch (err) {
      setError("Error processing files: " + err.message);
      console.error("File processing error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        </Box>
      </Paper>

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

import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import { GitHub, Link } from "@mui/icons-material";

function GitHubSection({ loading, onRepositorySelect }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    try {
      await onRepositorySelect(repoUrl.trim());
      setRepoUrl(""); // Clear input on success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setRepoUrl(e.target.value);
    if (error) setError(""); // Clear error when user types
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GitHub sx={{ mr: 1 }} />
          Analyze GitHub Repository
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter a GitHub repository URL to analyze its file structure
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          <TextField
            fullWidth
            placeholder="https://github.com/owner/repository or owner/repository"
            value={repoUrl}
            onChange={handleInputChange}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Link />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !repoUrl.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <GitHub />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: loading ? "none" : "translateY(-2px)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            {loading ? "Analyzing Repository..." : "Analyze Repository"}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          Examples: facebook/react, microsoft/vscode, nodejs/node
        </Typography>
      </Box>
    </Paper>
  );
}

export default GitHubSection;

import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  LinearProgress,
  Chip,
  Stack,
  Collapse,
} from "@mui/material";
import { GitHub, Link, Warning, CheckCircle, Info } from "@mui/icons-material";
import { GitHubAPI } from "../utils/github/GitHubAPI";

function GitHubSection({ loading, githubLoading, onRepositorySelect }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [checkingRateLimit, setCheckingRateLimit] = useState(false);

  // Check rate limit on component mount
  useEffect(() => {
    checkRateLimit();
  }, []);

  const checkRateLimit = async () => {
    setCheckingRateLimit(true);
    try {
      const api = new GitHubAPI();
      const rateLimitDetails = await api.checkRateLimit();
      if (rateLimitDetails) {
        setRateLimitInfo(api.rateLimitManager.getRateLimitDetails());
      }
    } catch (err) {
      console.warn("Failed to check rate limit:", err);
    } finally {
      setCheckingRateLimit(false);
    }
  };

  const isGithubDisabled =
    githubLoading || loading || (rateLimitInfo && !rateLimitInfo.canProceed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    // Check rate limit before proceeding
    if (rateLimitInfo && !rateLimitInfo.canProceed) {
      setError(`Cannot proceed: ${rateLimitInfo.message}`);
      return;
    }

    try {
      await onRepositorySelect(repoUrl.trim());
      setRepoUrl(""); // Clear input on success
    } catch (err) {
      setError(err.message);
      // Refresh rate limit info after error
      setTimeout(checkRateLimit, 1000);
    }
  };

  const handleInputChange = (e) => {
    setRepoUrl(e.target.value);
    if (error) setError(""); // Clear error when user types
  };

  const getRateLimitColor = () => {
    if (!rateLimitInfo) return "default";
    switch (rateLimitInfo.status) {
      case "exceeded":
        return "error";
      case "critical":
        return "error";
      case "warning":
        return "warning";
      case "good":
        return "success";
      default:
        return "default";
    }
  };

  const getRateLimitIcon = () => {
    if (!rateLimitInfo) return <Info />;
    switch (rateLimitInfo.status) {
      case "exceeded":
      case "critical":
        return <Warning />;
      case "warning":
        return <Warning />;
      case "good":
        return <CheckCircle />;
      default:
        return <Info />;
    }
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

        {/* Rate Limit Status */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Chip
              icon={
                checkingRateLimit ? (
                  <CircularProgress size={16} />
                ) : (
                  getRateLimitIcon()
                )
              }
              label={
                checkingRateLimit
                  ? "Checking rate limit..."
                  : rateLimitInfo
                  ? `${rateLimitInfo.remaining}/${rateLimitInfo.limit} API requests remaining`
                  : "Rate limit unknown"
              }
              color={getRateLimitColor()}
              variant="outlined"
              size="small"
            />
            <Button
              size="small"
              onClick={checkRateLimit}
              disabled={checkingRateLimit}
              variant="text"
            >
              Refresh
            </Button>
          </Stack>

          {rateLimitInfo && rateLimitInfo.percentage !== null && (
            <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={rateLimitInfo.percentage}
                color={getRateLimitColor()}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          )}

          <Collapse
            in={
              rateLimitInfo &&
              (rateLimitInfo.status === "warning" ||
                rateLimitInfo.status === "critical" ||
                rateLimitInfo.status === "exceeded")
            }
          >
            <Alert
              severity={
                rateLimitInfo?.status === "exceeded" ||
                rateLimitInfo?.status === "critical"
                  ? "error"
                  : "warning"
              }
              sx={{ mb: 2, maxWidth: 600, mx: "auto" }}
            >
              <Typography variant="body2">
                {rateLimitInfo?.message}
                {rateLimitInfo?.timeUntilReset > 0 && (
                  <>
                    <br />
                    <strong>Reset time:</strong>{" "}
                    {rateLimitInfo.resetTime?.toLocaleString()}
                  </>
                )}
              </Typography>
            </Alert>
          </Collapse>
        </Box>

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
            disabled={isGithubDisabled}
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
            disabled={isGithubDisabled || !repoUrl.trim()}
            startIcon={
              githubLoading ? <CircularProgress size={20} /> : <GitHub />
            }
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: isGithubDisabled ? "none" : "translateY(-2px)",
                boxShadow: isGithubDisabled
                  ? "none"
                  : "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            {githubLoading
              ? "Fetching Repository..."
              : loading
              ? "Processing Files..."
              : rateLimitInfo && !rateLimitInfo.canProceed
              ? "Rate Limit Exceeded"
              : "Analyze Repository"}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          Examples: facebook/react, microsoft/vscode, nodejs/node
        </Typography>

        {rateLimitInfo && rateLimitInfo.status === "good" && (
          <Typography
            variant="caption"
            color="success.main"
            sx={{ mt: 1, display: "block" }}
          >
            ✓ Sufficient API requests available for repository analysis
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default GitHubSection;

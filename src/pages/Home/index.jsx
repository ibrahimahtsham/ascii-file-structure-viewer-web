import { Container, Box, Typography, Alert, Divider } from "@mui/material";
import { useFileProcessor } from "./hooks/useFileProcessor";
import { useTimer } from "./hooks/useTimer";
import UploadSection from "./components/UploadSection";
import GitHubSection from "./components/GitHubSection";
import ProgressSection from "./components/ProgressSection";
import DebugConsole from "./components/DebugConsole";
import ResultsSection from "./components/ResultsSection";
import FileSelectionModal from "./components/FileSelectionModal";

function Home() {
  const {
    fileData,
    loading,
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
  } = useFileProcessor();

  const { elapsedTime, formatTime } = useTimer(loading);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          ASCII File Structure Viewer
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Upload a project folder or analyze a GitHub repository to visualize
          its structure and analyze code statistics
        </Typography>
      </Box>

      <UploadSection
        fileInputRef={fileInputRef}
        loading={loading}
        githubLoading={githubLoading}
        onFolderSelect={handleFolderSelect}
      />

      <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <GitHubSection
        loading={loading}
        githubLoading={githubLoading}
        onRepositorySelect={handleRepositorySelect}
      />

      <FileSelectionModal
        open={showSelectionModal}
        onClose={handleSelectionCancel}
        files={pendingFiles}
        onConfirm={handleSelectionConfirm}
      />

      <ProgressSection
        loading={loading}
        progress={progress}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        fileData={fileData}
      />

      <DebugConsole debugLogs={debugLogs} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <ResultsSection fileData={fileData} />
    </Container>
  );
}

export default Home;

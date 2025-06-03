import { Container, Box, Typography, Alert } from "@mui/material";
import { useFileProcessor } from "./hooks/useFileProcessor";
import { useTimer } from "./hooks/useTimer";
import UploadSection from "./components/UploadSection";
import ProgressSection from "./components/ProgressSection";
import DebugConsole from "./components/DebugConsole";
import ResultsSection from "./components/ResultsSection";

function Home() {
  const {
    fileData,
    loading,
    error,
    progress,
    debugLogs,
    fileInputRef,
    handleFolderSelect,
  } = useFileProcessor();

  const { elapsedTime, formatTime } = useTimer(loading);

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

      <UploadSection
        fileInputRef={fileInputRef}
        loading={loading}
        onFolderSelect={handleFolderSelect}
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

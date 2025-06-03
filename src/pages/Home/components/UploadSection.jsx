import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Folder, CloudUpload } from "@mui/icons-material";
import { MESSAGES } from "../utils/constants";

function UploadSection({ fileInputRef, loading, onFolderSelect }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ textAlign: "center" }}>
        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory=""
          multiple
          onChange={onFolderSelect}
          style={{ display: "none" }}
          id="folder-input"
        />
        <label htmlFor="folder-input">
          <Button
            variant="contained"
            component="span"
            size="large"
            startIcon={
              loading ? <CircularProgress size={20} /> : <CloudUpload />
            }
            disabled={loading}
            sx={{
              mb: 2,
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
            {loading ? MESSAGES.PROCESSING : MESSAGES.SELECT_PROJECT}
          </Button>
        </label>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400, mx: "auto" }}
        >
          {MESSAGES.SELECT_FOLDER}
        </Typography>
      </Box>
    </Paper>
  );
}

export default UploadSection;

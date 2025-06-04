import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useDebounce } from "./hooks/useDebounce";
import SearchSection from "./components/SearchSection";
import IgnorePatternsSection from "./components/IgnorePatternsSection";
import StatisticsSection from "./components/StatisticsSection";
import FileTreeSection from "./components/FileTreeSection";
import { useFileSelection } from "./hooks/useFileSelection";
import { useFileTree } from "./hooks/useFileTree";
import { useIgnorePatterns } from "./hooks/useIgnorePatterns";

const DEFAULT_IGNORE_PATTERNS = [
  "node_modules/",
  ".git/",
  "dist/",
  "build/",
  ".vscode/",
  "__pycache__/",
  ".next/",
  "coverage/",
  ".gitignore",
  "eslint.config.js",
  "package-lock.json",
  "package.json",
];

function FileSelectionModal({
  open,
  onClose,
  files,
  onConfirm,
  defaultIgnorePatterns = DEFAULT_IGNORE_PATTERNS,
}) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  const { ignorePatterns, addPattern, removePattern } = useIgnorePatterns(
    defaultIgnorePatterns
  );
  const { fileTree } = useFileTree(files);
  const {
    selectedFiles,
    filteredFiles,
    handleFileToggle,
    handleFolderToggle,
    handleSelectAll,
    handleDeselectAll,
  } = useFileSelection(files, debouncedSearchTerm, ignorePatterns);

  const handleConfirm = useCallback(() => {
    const selectedFilesList = files.filter((file) =>
      selectedFiles.has(file.webkitRelativePath)
    );
    onConfirm(selectedFilesList, ignorePatterns);
  }, [files, selectedFiles, ignorePatterns, onConfirm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Select Files to Process</Typography>
          <Box>
            <Button
              startIcon={<CheckBox />}
              onClick={handleSelectAll}
              size="small"
              sx={{ mr: 1 }}
            >
              All
            </Button>
            <Button
              startIcon={<CheckBoxOutlineBlank />}
              onClick={handleDeselectAll}
              size="small"
            >
              None
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <SearchSection
          searchInput={searchInput}
          onSearchChange={setSearchInput}
        />

        <IgnorePatternsSection
          ignorePatterns={ignorePatterns}
          onAddPattern={addPattern}
          onRemovePattern={removePattern}
        />

        <StatisticsSection
          selectedCount={selectedFiles.size}
          filteredCount={filteredFiles.length}
        />

        <FileTreeSection
          fileTree={fileTree}
          selectedFiles={selectedFiles}
          filteredFiles={filteredFiles}
          onFileToggle={handleFileToggle}
          onFolderToggle={handleFolderToggle}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedFiles.size === 0}
        >
          Process {selectedFiles.size} Files
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FileSelectionModal;

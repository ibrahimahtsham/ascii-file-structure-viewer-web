import { PROCESSING_CONFIG } from "../utils/constants.js";
import { getFileExtension, isSupportedFile } from "../utils/fileUtils.js";

export class FileAnalyzer {
  constructor() {
    this.config = PROCESSING_CONFIG;
  }

  isValidFile(file) {
    // For GitHub files, we already have the content, so size check is different
    if (file.isGitHubFile) {
      return true; // GitHub API already filters out very large files
    }
    return file.size < this.config.MAX_FILE_SIZE;
  }

  shouldProcessContent(file) {
    const extension = getFileExtension(file.name);

    // For GitHub files, we already have content
    if (file.isGitHubFile) {
      return true;
    }

    // Always try to process supported files, regardless of size for text files
    return (
      isSupportedFile(extension, file.size, this.config.MAX_CONTENT_SIZE) ||
      this.isSmallTextFile(file, extension)
    );
  }

  isSmallTextFile(file, extension) {
    // For small text files, always try to process them
    const textExtensions = new Set([
      ".bat",
      ".cmd",
      ".sh",
      ".ps1",
      ".gitignore",
      ".env",
      ".sql",
    ]);
    return textExtensions.has(extension) && file.size < 50 * 1024; // 50KB limit for text files
  }

  isLargeFile(file) {
    return file.size > this.config.LARGE_FILE_THRESHOLD;
  }

  analyzeFile(file) {
    const extension = getFileExtension(file.name);

    return {
      name: file.name,
      path: file.webkitRelativePath,
      size: file.size,
      extension,
      type: file.type || "unknown",
      lastModified: file.lastModified,
      isValid: this.isValidFile(file),
      shouldProcessContent: this.shouldProcessContent(file),
      isLarge: this.isLargeFile(file),
      isGitHubFile: file.isGitHubFile || false,
    };
  }
}

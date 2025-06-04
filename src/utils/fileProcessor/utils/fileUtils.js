import { SUPPORTED_EXTENSIONS, DEFAULT_IGNORE_PATHS } from "./constants.js";

export const getFileExtension = (filename) => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(lastDot) : "";
};

export const isSupportedFile = (extension, fileSize, maxSize) => {
  return SUPPORTED_EXTENSIONS.has(extension) && fileSize < maxSize;
};

export const shouldIgnoreFile = (path, customIgnorePatterns = []) => {
  const allIgnorePaths = [...DEFAULT_IGNORE_PATHS, ...customIgnorePatterns];
  return allIgnorePaths.some((ignore) => path.includes(ignore));
};

export const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) =>
      reject(
        new Error(
          `Failed to read file: ${e.target.error?.message || "Unknown error"}`
        )
      );
    reader.readAsText(file);
  });
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatTime = (seconds) => {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  }
  return `${seconds.toFixed(2)}s`;
};

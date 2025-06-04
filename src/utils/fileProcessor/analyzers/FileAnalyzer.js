import { PROCESSING_CONFIG } from "../utils/constants.js";
import { getFileExtension, isSupportedFile } from "../utils/fileUtils.js";

export class FileAnalyzer {
  constructor() {
    this.config = PROCESSING_CONFIG;
  }

  isValidFile(file) {
    return file.size < this.config.MAX_FILE_SIZE;
  }

  shouldProcessContent(file) {
    const extension = getFileExtension(file.name);
    return isSupportedFile(extension, file.size, this.config.MAX_CONTENT_SIZE);
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
    };
  }
}

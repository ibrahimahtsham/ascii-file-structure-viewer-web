import { readFileContent } from '../utils/fileUtils.js';

export class ContentProcessor {
  async processFileContent(file, analyzer, debug) {
    const fileStartTime = performance.now();
    const analysis = analyzer.analyzeFile(file);
    let lines = 0;
    let content = "";

    // Always try to process text-based files for line counting
    if (analysis.shouldProcessContent || this.isTextBasedFile(analysis.extension)) {
      try {
        content = await readFileContent(file);
        lines = content.split("\n").length;

        if (analysis.isLarge) {
          const fileTime = performance.now() - fileStartTime;
          debug(
            `📄 Processed large file: ${file.name} (${(
              file.size / 1024
            ).toFixed(1)}KB, ${lines} lines) in ${fileTime.toFixed(2)}ms`
          );
        }
      } catch (error) {
        debug(`❌ Error reading file ${file.name}: ${error.message}`);
        // For binary files that can't be read as text, don't treat as error
        if (this.isBinaryFile(analysis.extension)) {
          debug(`📦 Binary file detected: ${file.name} - skipping content analysis`);
        }
      }
    }

    return {
      ...analysis,
      lines,
      content: content.substring(0, 1000), // Store first 1000 chars for preview
    };
  }

  isTextBasedFile(extension) {
    const textExtensions = new Set([
      ".bat", ".cmd", ".sh", ".ps1", // Script files
      ".svg", ".xml", ".html", // Markup files (SVG is XML-based)
      ".yml", ".yaml", ".toml", ".ini", ".conf", // Config files
      ".gitignore", ".gitattributes", ".editorconfig", // Git/Editor files
      ".dockerfile", ".dockerignore", // Docker files
      ".sql", ".graphql", ".gql", // Database/Query files
      ".log", ".env", ".env.example", // Log/Environment files
      ".md", ".txt", ".json", // Documentation/Data files
    ]);
    return textExtensions.has(extension);
  }

  isBinaryFile(extension) {
    const binaryExtensions = new Set([
      ".png", ".jpg", ".jpeg", ".gif", ".ico", ".bmp", ".webp", // Images
      ".pdf", ".zip", ".tar", ".gz", ".7z", ".rar", // Archives/Documents
      ".exe", ".dll", ".so", ".dylib", // Executables/Libraries
      ".ttf", ".otf", ".woff", ".woff2", // Fonts
    ]);
    return binaryExtensions.has(extension);
  }
}

import { readFileContent } from "../utils/fileUtils.js";

export class ContentProcessor {
  async processFileContent(file, analyzer, debug) {
    const fileStartTime = performance.now();
    const analysis = analyzer.analyzeFile(file);
    let lines = 0;
    let content = "";

    if (analysis.shouldProcessContent) {
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
      }
    }

    return {
      ...analysis,
      lines,
      content: content.substring(0, 1000), // Store first 1000 chars for preview
    };
  }
}

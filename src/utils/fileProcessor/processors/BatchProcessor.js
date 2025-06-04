import { PROCESSING_CONFIG } from "../utils/constants.js";
import { yieldControl } from "../utils/progressUtils.js";
import { ContentProcessor } from "./ContentProcessor.js";

export class BatchProcessor {
  constructor() {
    this.config = PROCESSING_CONFIG;
    this.contentProcessor = new ContentProcessor();
  }

  async processBatch(files, analyzer, statsCalculator, debug, onProgress) {
    const results = [];
    let processedCount = 0;

    for (let i = 0; i < files.length; i += this.config.BATCH_SIZE) {
      const batch = files.slice(i, i + this.config.BATCH_SIZE);

      debug(
        `📦 Processing batch ${
          Math.floor(i / this.config.BATCH_SIZE) + 1
        }/${Math.ceil(files.length / this.config.BATCH_SIZE)} (${
          batch.length
        } files)`
      );

      // Process each file in the batch
      for (const file of batch) {
        const fileResult = await this.contentProcessor.processFileContent(
          file,
          analyzer,
          debug
        );

        results.push(fileResult);
        statsCalculator.updateStats(fileResult);
        processedCount++;

        // Report progress
        if (onProgress) {
          onProgress(processedCount, files.length);
        }

        // Yield control periodically
        if (processedCount % this.config.YIELD_FREQUENCY === 0) {
          await yieldControl(this.config.YIELD_INTERVAL);
        }
      }

      // Yield control after each batch
      await yieldControl(this.config.YIELD_INTERVAL);
    }

    return results;
  }
}

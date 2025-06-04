import { FileAnalyzer } from "../analyzers/FileAnalyzer.js";
import { StatsCalculator } from "../analyzers/StatsCalculator.js";
import { BatchProcessor } from "./BatchProcessor.js";
import { TreeBuilder } from "../builders/TreeBuilder.js";
import { AsciiTreeBuilder } from "../builders/AsciiTreeBuilder.js";
import {
  createProgressReporter,
  yieldControl,
} from "../utils/progressUtils.js";
import { PHASE_NAMES } from "../utils/constants.js";

export class FileProcessor {
  constructor() {
    this.analyzer = new FileAnalyzer();
    this.statsCalculator = new StatsCalculator();
    this.batchProcessor = new BatchProcessor();
    this.treeBuilder = new TreeBuilder();
    this.asciiTreeBuilder = new AsciiTreeBuilder();
    this.customIgnorePatterns = [];
  }

  setCustomIgnorePatterns(patterns) {
    this.customIgnorePatterns = patterns;
  }

  async processFiles(files, onProgress = null, onDebug = null) {
    const startTime = performance.now();
    const debug = onDebug || console.log;

    // Track phase timings
    const phaseTimings = {
      filtering: 0,
      processing: 0,
      building: 0,
      ascii: 0,
    };

    debug(`🚀 Starting file processing with ${files.length} files`);

    // Reset stats
    this.statsCalculator.reset();

    // Create progress reporter
    const reportProgress = createProgressReporter(onProgress, phaseTimings);

    // Initial progress report
    reportProgress(PHASE_NAMES.FILTERING, 0, files.length);
    await yieldControl();

    // Phase 1: Filtering
    debug("📁 Filtering files...");
    const filterStartTime = performance.now();

    const validFiles = files.filter((file) => this.analyzer.isValidFile(file));

    phaseTimings.filtering = (performance.now() - filterStartTime) / 1000;
    debug(`✅ Filtered to ${validFiles.length} valid files`);

    if (validFiles.length === 0) {
      debug("⚠️ No valid files found after filtering");
      reportProgress(PHASE_NAMES.ASCII, 0, 0);

      return {
        structure: {},
        stats: this.statsCalculator.addProcessingTime(
          (performance.now() - startTime) / 1000,
          phaseTimings
        ),
        asciiTree: "",
      };
    }

    // Phase 2: Processing files
    debug(`📊 Processing ${validFiles.length} files`);
    const processingStartTime = performance.now();

    const progressReporter = (processedCount, totalFiles) => {
      phaseTimings.processing =
        (performance.now() - processingStartTime) / 1000;
      reportProgress(PHASE_NAMES.PROCESSING, processedCount, totalFiles);
    };

    const fileStructure = await this.batchProcessor.processBatch(
      validFiles,
      this.analyzer,
      this.statsCalculator,
      debug,
      progressReporter
    );

    phaseTimings.processing = (performance.now() - processingStartTime) / 1000;

    // Phase 3: Building tree structure
    debug("🏗️ Building tree structure...");
    const treeStartTime = performance.now();
    reportProgress(PHASE_NAMES.BUILDING, validFiles.length, validFiles.length);
    await yieldControl();

    const structure = this.treeBuilder.buildTreeStructure(fileStructure);
    phaseTimings.building = (performance.now() - treeStartTime) / 1000;
    debug(
      `✅ Tree structure built in ${(phaseTimings.building * 1000).toFixed(
        2
      )}ms`
    );

    // Phase 4: Generating ASCII tree
    debug("🌳 Generating ASCII tree...");
    const asciiStartTime = performance.now();
    reportProgress(PHASE_NAMES.ASCII, validFiles.length, validFiles.length);
    await yieldControl();

    const asciiTree = this.asciiTreeBuilder.generateAsciiTree(fileStructure);
    phaseTimings.ascii = (performance.now() - asciiStartTime) / 1000;
    debug(
      `✅ ASCII tree generated in ${(phaseTimings.ascii * 1000).toFixed(2)}ms`
    );

    // Final results
    const totalProcessingTime = (performance.now() - startTime) / 1000;

    debug(
      `🎉 Processing complete! Total time: ${totalProcessingTime.toFixed(3)}s`
    );
    debug(`📈 Performance breakdown:
      - Filtering: ${(phaseTimings.filtering * 1000).toFixed(2)}ms
      - File processing: ${(phaseTimings.processing * 1000).toFixed(2)}ms
      - Tree building: ${(phaseTimings.building * 1000).toFixed(2)}ms
      - ASCII generation: ${(phaseTimings.ascii * 1000).toFixed(2)}ms`);

    reportProgress(PHASE_NAMES.ASCII, validFiles.length, validFiles.length);

    return {
      structure,
      stats: this.statsCalculator.addProcessingTime(
        totalProcessingTime,
        phaseTimings
      ),
      asciiTree,
    };
  }
}

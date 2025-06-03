export class FileProcessor {
  constructor() {
    this.supportedExtensions = new Set([
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".h",
      ".css",
      ".scss",
      ".html",
      ".xml",
      ".json",
      ".md",
      ".txt",
      ".php",
      ".rb",
      ".go",
      ".rs",
      ".swift",
      ".kt",
      ".dart",
      ".vue",
      ".svelte",
    ]);
    this.batchSize = 5;
    this.yieldInterval = 1;
  }

  async processFiles(files, onProgress = null, onDebug = null) {
    const startTime = performance.now();
    const debug = onDebug || console.log;

    debug(`🚀 Starting file processing with ${files.length} files`);

    const fileStructure = [];
    const stats = {
      totalFiles: 0,
      totalLines: 0,
      fileTypes: {},
      largestFile: { name: "", lines: 0 },
      totalSize: 0,
    };

    // Immediate progress report
    if (onProgress) {
      onProgress(0, 0, files.length);
      await this.yieldControl();
    }

    debug("📁 Filtering files...");
    const filterStartTime = performance.now();

    // Filter files in chunks with proper progress reporting
    const validFiles = [];
    const filterBatchSize = 100; // Larger batch for filtering

    for (let i = 0; i < files.length; i += filterBatchSize) {
      const batch = files.slice(i, i + filterBatchSize);
      const filteredBatch = batch.filter(
        (file) => !this.shouldIgnoreFile(file.webkitRelativePath)
      );
      validFiles.push(...filteredBatch);

      // Update progress during filtering (first 5% of total progress)
      if (onProgress) {
        const filterProgress = Math.min(
          ((i + filterBatchSize) / files.length) * 5,
          5
        );
        onProgress(filterProgress, 0, files.length);
      }

      await this.yieldControl();
    }

    const filterTime = performance.now() - filterStartTime;
    debug(
      `✅ Filtered ${files.length} files to ${
        validFiles.length
      } valid files in ${filterTime.toFixed(2)}ms`
    );

    if (validFiles.length === 0) {
      debug("⚠️ No valid files found after filtering");
      if (onProgress) {
        onProgress(100, 0, 0);
      }
      return {
        structure: {},
        stats: {
          ...stats,
          processingTime: (performance.now() - startTime) / 1000,
        },
        asciiTree: "",
      };
    }

    // Process files in batches with accurate progress
    debug(
      `📊 Processing ${validFiles.length} files in batches of ${this.batchSize}`
    );
    let processedCount = 0;

    for (let i = 0; i < validFiles.length; i += this.batchSize) {
      const batch = validFiles.slice(i, i + this.batchSize);

      debug(
        `📦 Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(
          validFiles.length / this.batchSize
        )} (${batch.length} files)`
      );

      // Process each file in the batch
      for (const file of batch) {
        const fileResult = await this.processFile(file, debug);
        fileStructure.push(fileResult);
        this.updateStats(stats, fileResult);
        processedCount++;

        // Update progress for each file (5% to 90% of total progress)
        if (onProgress) {
          const progress = 5 + (processedCount / validFiles.length) * 85;
          onProgress(progress, processedCount, validFiles.length);
        }

        // Yield control every few files
        if (processedCount % 2 === 0) {
          await this.yieldControl();
        }
      }

      // Yield control after each batch
      await this.yieldControl();
    }

    debug("🏗️ Building tree structure...");
    const treeStartTime = performance.now();
    if (onProgress) {
      onProgress(90, validFiles.length, validFiles.length);
      await this.yieldControl();
    }

    const structure = this.buildTreeStructure(fileStructure);
    const treeTime = performance.now() - treeStartTime;
    debug(`✅ Tree structure built in ${treeTime.toFixed(2)}ms`);

    if (onProgress) {
      onProgress(95, validFiles.length, validFiles.length);
      await this.yieldControl();
    }

    debug("🌳 Generating ASCII tree...");
    const asciiStartTime = performance.now();
    const asciiTree = this.generateAsciiTree(fileStructure);
    const asciiTime = performance.now() - asciiStartTime;
    debug(`✅ ASCII tree generated in ${asciiTime.toFixed(2)}ms`);

    const endTime = performance.now();
    const totalProcessingTime = (endTime - startTime) / 1000;

    debug(
      `🎉 Processing complete! Total time: ${totalProcessingTime.toFixed(3)}s`
    );
    debug(`📈 Performance breakdown:
      - Filtering: ${filterTime.toFixed(2)}ms
      - File processing: ${(
        endTime -
        filterStartTime -
        filterTime -
        treeTime -
        asciiTime
      ).toFixed(2)}ms
      - Tree building: ${treeTime.toFixed(2)}ms
      - ASCII generation: ${asciiTime.toFixed(2)}ms`);

    if (onProgress) {
      onProgress(100, validFiles.length, validFiles.length);
    }

    return {
      structure,
      stats: {
        ...stats,
        processingTime: totalProcessingTime,
      },
      asciiTree,
    };
  }

  async yieldControl() {
    return new Promise((resolve) => setTimeout(resolve, this.yieldInterval));
  }

  shouldIgnoreFile(path) {
    const ignorePaths = [
      "node_modules/",
      ".git/",
      "__pycache__/",
      ".vscode/",
      "dist/",
      "build/",
      ".next/",
      "coverage/",
      ".nyc_output/",
      ".idea/",
      "target/",
      "bin/",
      "obj/",
      ".vs/",
      ".venv/",
    ];
    return ignorePaths.some((ignore) => path.includes(ignore));
  }

  async processFile(file, debug) {
    const fileStartTime = performance.now();
    const extension = this.getFileExtension(file.name);
    let lines = 0;
    let content = "";

    if (this.supportedExtensions.has(extension) && file.size < 1024 * 1024) {
      try {
        content = await this.readFileContent(file);
        lines = content.split("\n").length;

        if (file.size > 100 * 1024) {
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
      name: file.name,
      path: file.webkitRelativePath,
      size: file.size,
      extension,
      lines,
      type: file.type || "unknown",
      lastModified: file.lastModified,
    };
  }

  readFileContent(file) {
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
  }

  getFileExtension(filename) {
    const lastDot = filename.lastIndexOf(".");
    return lastDot > 0 ? filename.substring(lastDot) : "";
  }

  updateStats(stats, fileData) {
    stats.totalFiles++;
    stats.totalLines += fileData.lines;
    stats.totalSize += fileData.size;

    const ext = fileData.extension || "no-extension";
    stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;

    if (fileData.lines > stats.largestFile.lines) {
      stats.largestFile = { name: fileData.name, lines: fileData.lines };
    }
  }

  buildTreeStructure(files) {
    const tree = {};

    files.forEach((file) => {
      const parts = file.path.split("/");
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? file : {};
        }
        current = current[part];
      });
    });

    return tree;
  }

  generateAsciiTree(files) {
    const tree = this.buildTreeStructure(files);
    return this.renderAsciiTree(tree, "", true);
  }

  renderAsciiTree(node, prefix = "") {
    let result = "";
    const entries = Object.entries(node);

    entries.forEach(([key, value], index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";

      result += prefix + connector + key + "\n";

      if (typeof value === "object" && !value.name) {
        const nextPrefix = prefix + (isLastEntry ? "    " : "│   ");
        result += this.renderAsciiTree(value, nextPrefix, isLastEntry);
      }
    });

    return result;
  }
}

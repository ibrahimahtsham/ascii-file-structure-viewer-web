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
  }

  async processFiles(files) {
    const fileStructure = [];
    const stats = {
      totalFiles: 0,
      totalLines: 0,
      fileTypes: {},
      largestFile: { name: "", lines: 0 },
      totalSize: 0,
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.shouldIgnoreFile(file.webkitRelativePath)) continue;

      const fileData = await this.processFile(file);
      fileStructure.push(fileData);
      this.updateStats(stats, fileData);
    }

    return {
      structure: this.buildTreeStructure(fileStructure),
      stats,
      asciiTree: this.generateAsciiTree(fileStructure),
    };
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
    ];
    return ignorePaths.some((ignore) => path.includes(ignore));
  }

  async processFile(file) {
    const extension = this.getFileExtension(file.name);
    let lines = 0;
    let content = "";

    if (this.supportedExtensions.has(extension) && file.size < 1024 * 1024) {
      // 1MB limit
      try {
        content = await this.readFileContent(file);
        lines = content.split("\n").length;
      } catch (error) {
        console.warn(`Could not read file: ${file.name}`, error);
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
      reader.onerror = reject;
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

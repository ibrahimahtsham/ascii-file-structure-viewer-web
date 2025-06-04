import { TreeBuilder } from "./TreeBuilder.js";

export class AsciiTreeBuilder {
  constructor() {
    this.treeBuilder = new TreeBuilder();
  }

  generateAsciiTree(files) {
    const tree = this.treeBuilder.buildTreeStructure(files);
    return this.renderAsciiTree(tree);
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

  generateDetailedAsciiTree(files, options = {}) {
    const { showSizes = false, showLines = false } = options;
    const tree = this.treeBuilder.buildTreeStructure(files);

    return this.renderDetailedAsciiTree(tree, "", true, showSizes, showLines);
  }

  renderDetailedAsciiTree(node, prefix = "", showSizes, showLines) {
    let result = "";
    const entries = Object.entries(node);

    entries.forEach(([key, value], index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";

      let displayName = key;

      // Add file details if it's a file
      if (value.name) {
        const details = [];
        if (showLines && value.lines) {
          details.push(`${value.lines} lines`);
        }
        if (showSizes && value.size) {
          details.push(`${(value.size / 1024).toFixed(1)}KB`);
        }
        if (details.length > 0) {
          displayName += ` (${details.join(", ")})`;
        }
      }

      result += prefix + connector + displayName + "\n";

      if (typeof value === "object" && !value.name) {
        const nextPrefix = prefix + (isLastEntry ? "    " : "│   ");
        result += this.renderDetailedAsciiTree(
          value,
          nextPrefix,
          isLastEntry,
          showSizes,
          showLines
        );
      }
    });

    return result;
  }
}

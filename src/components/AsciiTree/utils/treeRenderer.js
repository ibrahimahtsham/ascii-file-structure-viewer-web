import { formatBytes } from "./formatUtils";
import { getFileColorClass } from "./colorUtils";

export const renderTreeNode = (
  node,
  options,
  prefix = "",
  currentPath = ""
) => {
  const { isIgnored, showLines, showColors, showSizes } = options;
  let result = "";

  const entries = Object.entries(node).filter(([key]) => {
    const itemPath = currentPath ? `${currentPath}/${key}` : key;
    return !isIgnored(itemPath);
  });

  entries.forEach(([key, value], index) => {
    const isLastEntry = index === entries.length - 1;
    const connector = isLastEntry ? "└── " : "├── ";
    const itemPath = currentPath ? `${currentPath}/${key}` : key;
    const isFile = value && value.name;

    let displayText = key;

    if (showLines && isFile && value.lines > 0) {
      displayText += ` (${value.lines} lines)`;
    }

    if (showSizes && isFile) {
      displayText += ` [${formatBytes(value.size)}]`;
    }

    let lineOutput;
    if (showColors && isFile) {
      const colorClass = getFileColorClass(value.lines);
      lineOutput = `${prefix}${connector}<span class="${colorClass}">📄 ${displayText}</span>\n`;
    } else if (showColors && !isFile) {
      lineOutput = `${prefix}${connector}<span class="folder">📁 ${displayText}</span>\n`;
    } else {
      const icon = isFile ? "📄" : "📁";
      lineOutput = `${prefix}${connector}${icon} ${displayText}\n`;
    }

    result += lineOutput;

    if (!isFile && typeof value === "object") {
      const nextPrefix = prefix + (isLastEntry ? "    " : "│   ");
      result += renderTreeNode(value, options, nextPrefix, itemPath);
    }
  });

  return result;
};

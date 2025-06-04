export const SUPPORTED_EXTENSIONS = new Set([
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

export const DEFAULT_IGNORE_PATHS = [
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
  ".gitignore",
  "eslint.config.js",
  "package-lock.json",
  "package.json",
];

export const PROCESSING_CONFIG = {
  BATCH_SIZE: 5,
  YIELD_INTERVAL: 1,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CONTENT_SIZE: 1024 * 1024, // 1MB
  LARGE_FILE_THRESHOLD: 100 * 1024, // 100KB
  YIELD_FREQUENCY: 2, // Yield every 2 files
};

export const PHASE_RANGES = {
  FILTERING: { start: 0, end: 5 },
  PROCESSING: { start: 5, end: 90 },
  BUILDING: { start: 90, end: 95 },
  ASCII: { start: 95, end: 100 },
};

export const PHASE_NAMES = {
  FILTERING: "filtering",
  PROCESSING: "processing",
  BUILDING: "building",
  ASCII: "ascii",
};

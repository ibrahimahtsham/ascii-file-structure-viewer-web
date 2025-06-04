export const MIME_TYPES = {
  js: "text/javascript",
  jsx: "text/javascript",
  ts: "text/typescript",
  tsx: "text/typescript",
  json: "application/json",
  html: "text/html",
  css: "text/css",
  md: "text/markdown",
  txt: "text/plain",
  py: "text/x-python",
  java: "text/x-java-source",
  cpp: "text/x-c++src",
  c: "text/x-csrc",
  h: "text/x-chdr",
  php: "text/x-php",
  rb: "text/x-ruby",
  go: "text/x-go",
  rs: "text/x-rust",
  kt: "text/x-kotlin",
  swift: "text/x-swift",
  sql: "text/x-sql",
  xml: "text/xml",
  yaml: "text/yaml",
  yml: "text/yaml",
  toml: "text/x-toml",
  ini: "text/x-ini",
  conf: "text/x-config",
  log: "text/plain",
  sh: "text/x-shellscript",
  bat: "text/x-batch",
  ps1: "text/x-powershell",
};

export function getMimeType(filename) {
  if (!filename || typeof filename !== "string") {
    return "text/plain";
  }

  const ext = filename.split(".").pop()?.toLowerCase();
  return MIME_TYPES[ext] || "text/plain";
}

export function isTextFile(filename) {
  const mimeType = getMimeType(filename);
  return (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/xml"
  );
}

export function isBinaryFile(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const binaryExtensions = new Set([
    "png",
    "jpg",
    "jpeg",
    "gif",
    "ico",
    "bmp",
    "webp",
    "svg",
    "pdf",
    "zip",
    "tar",
    "gz",
    "7z",
    "rar",
    "exe",
    "dll",
    "so",
    "dylib",
    "ttf",
    "otf",
    "woff",
    "woff2",
    "mp3",
    "mp4",
    "avi",
    "mov",
    "wav",
  ]);

  return binaryExtensions.has(ext);
}

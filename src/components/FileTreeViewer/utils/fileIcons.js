export const getFileIcon = (extension) => {
  const iconMap = {
    ".js": "📄",
    ".jsx": "⚛️",
    ".ts": "📘",
    ".tsx": "⚛️",
    ".py": "🐍",
    ".java": "☕",
    ".cpp": "⚙️",
    ".c": "⚙️",
    ".html": "🌐",
    ".css": "🎨",
    ".scss": "🎨",
    ".json": "📋",
    ".md": "📝",
    ".txt": "📄",
    ".xml": "📄",
    ".php": "🐘",
    ".rb": "💎",
    ".go": "🐹",
    ".rs": "🦀",
    ".swift": "🐦",
    ".kt": "🎯",
    ".dart": "🎯",
    ".vue": "💚",
    ".svelte": "🧡",
    // Add missing file types
    ".bat": "⚡",
    ".cmd": "⚡",
    ".sh": "🐚",
    ".ps1": "💙",
    ".svg": "🎨",
    ".yml": "⚙️",
    ".yaml": "⚙️",
    ".gitignore": "🚫",
    ".env": "🔧",
    ".sql": "🗄️",
    ".dockerfile": "🐳",
    ".log": "📋",
  };
  return iconMap[extension] || "📄";
};

export const getFileTypeColor = (lines) => {
  if (lines > 1000) return "error.main";
  if (lines > 500) return "warning.main";
  if (lines > 100) return "info.main";
  return "success.main";
};

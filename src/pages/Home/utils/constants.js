export const TIMER_UPDATE_INTERVAL = 100; // ms
export const UI_UPDATE_DELAY = 10; // ms

export const MESSAGES = {
  SELECT_FOLDER:
    "Choose a folder from your computer to analyze its file structure",
  PROCESSING: "Processing...",
  SELECT_PROJECT: "Select Project Folder",
  DEBUG_CONSOLE: "Debug Console",
};

export const PROCESSING_PHASES = {
  FILTERING: {
    name: "Filtering Files",
    icon: "FilterAlt",
    range: [0, 5], // 0-5%
  },
  PROCESSING: {
    name: "Processing Files",
    icon: "Code",
    range: [5, 90], // 5-90%
  },
  BUILDING: {
    name: "Building Tree",
    icon: "AccountTree",
    range: [90, 95], // 90-95%
  },
  ASCII: {
    name: "Generating ASCII",
    icon: "Build",
    range: [95, 100], // 95-100%
  },
};

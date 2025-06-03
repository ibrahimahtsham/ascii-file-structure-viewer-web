import { FilterAlt, Code, AccountTree, Build } from "@mui/icons-material";

export const PHASE_CONFIG = {
  filtering: {
    label: "Filtering Files",
    icon: FilterAlt,
    range: [0, 5], // 0-5%
  },
  processing: {
    label: "Processing Files",
    icon: Code,
    range: [5, 90], // 5-90%
  },
  building: {
    label: "Building Tree",
    icon: AccountTree,
    range: [90, 95], // 90-95%
  },
  ascii: {
    label: "Generating ASCII",
    icon: Build,
    range: [95, 100], // 95-100%
  },
};

export const PHASE_ORDER = ["filtering", "processing", "building", "ascii"];

export const PROGRESS_MESSAGES = {
  PROCESSING: "Processing Files",
  COMPLETE: "Processing Complete",
  PHASES: "Processing Phases",
  SUMMARY: "Processing Summary",
};

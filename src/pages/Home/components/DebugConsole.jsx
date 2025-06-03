import { useState } from "react";
import { Paper, Typography, Box, IconButton, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { MESSAGES } from "../utils/constants";

function DebugConsole({ debugLogs }) {
  const [showDebug, setShowDebug] = useState(false);

  if (debugLogs.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {MESSAGES.DEBUG_CONSOLE} ({debugLogs.length} logs)
        </Typography>
        <IconButton onClick={() => setShowDebug(!showDebug)} size="small">
          {showDebug ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={showDebug}>
        <Box
          sx={{
            maxHeight: 300,
            overflow: "auto",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.87)"
                : "rgba(0, 0, 0, 0.87)",
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.12)"
              }`,
            p: 1,
            borderRadius: 1,
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: 1.4,
          }}
        >
          {debugLogs.map((log, index) => (
            <Box
              key={index}
              sx={{
                py: 0.25,
                borderBottom:
                  index < debugLogs.length - 1
                    ? (theme) =>
                        `1px solid ${
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.08)"
                        }`
                    : "none",
              }}
            >
              {log}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default DebugConsole;

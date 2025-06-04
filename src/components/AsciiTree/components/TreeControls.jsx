import { Box, Switch, FormControlLabel, Stack } from "@mui/material";
import { Code, Visibility, Palette } from "@mui/icons-material";

function TreeControls({ showLines, showColors, showSizes, onToggle }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
      <FormControlLabel
        control={
          <Switch
            checked={showLines}
            onChange={() => onToggle("lines")}
            size="small"
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Code sx={{ mr: 0.5, fontSize: 16 }} />
            Lines
          </Box>
        }
      />

      <FormControlLabel
        control={
          <Switch
            checked={showColors}
            onChange={() => onToggle("colors")}
            size="small"
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Palette sx={{ mr: 0.5, fontSize: 16 }} />
            Colors
          </Box>
        }
      />

      <FormControlLabel
        control={
          <Switch
            checked={showSizes}
            onChange={() => onToggle("sizes")}
            size="small"
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Visibility sx={{ mr: 0.5, fontSize: 16 }} />
            Sizes
          </Box>
        }
      />
    </Stack>
  );
}

export default TreeControls;

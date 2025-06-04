import { Box, Typography, Chip, Stack, Tooltip } from "@mui/material";
import { COLOR_LEGEND_CONFIG } from "../utils/colorUtils";

function ColorLegend({ showColors }) {
  if (!showColors) return null;

  return (
    <Box sx={{ mb: 2, p: 1, bgcolor: "background.default", borderRadius: 1 }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, mb: 1, display: "block" }}
      >
        Color Legend:
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {COLOR_LEGEND_CONFIG.map((item) => (
          <Tooltip key={item.type} title={item.tooltip}>
            <Chip
              label={item.label}
              size="small"
              sx={{ color: item.color, borderColor: item.color }}
              variant="outlined"
            />
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}

export default ColorLegend;

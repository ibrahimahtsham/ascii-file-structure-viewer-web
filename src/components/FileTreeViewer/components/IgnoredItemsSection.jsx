import { Box, Typography, Button, Chip, Stack, Divider } from "@mui/material";

function IgnoredItemsSection({ ignoredItems, onClearAll, onRemoveItem }) {
  if (ignoredItems.size === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Ignored items ({ignoredItems.size}):
        </Typography>
        <Button
          size="small"
          onClick={onClearAll}
          variant="outlined"
          color="secondary"
        >
          Clear All
        </Button>
      </Stack>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {Array.from(ignoredItems)
          .slice(0, 5)
          .map((item) => (
            <Chip
              key={item}
              label={item.split("/").pop()}
              size="small"
              variant="outlined"
              color="secondary"
              onDelete={() => onRemoveItem(item)}
            />
          ))}
        {ignoredItems.size > 5 && (
          <Chip
            label={`+${ignoredItems.size - 5} more`}
            size="small"
            variant="outlined"
            color="secondary"
          />
        )}
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

export default IgnoredItemsSection;

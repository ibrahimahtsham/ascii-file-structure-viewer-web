import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, FilterList } from "@mui/icons-material";

function IgnorePatternsSection({
  ignorePatterns,
  onAddPattern,
  onRemovePattern,
}) {
  const [newPattern, setNewPattern] = useState("");

  const handleAddPattern = () => {
    if (onAddPattern(newPattern)) {
      setNewPattern("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddPattern();
    }
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="subtitle2">
            Ignore Patterns ({ignorePatterns.length})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add ignore pattern (e.g., *.log, temp/)"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={handleAddPattern}
                  disabled={!newPattern.trim()}
                >
                  Add
                </Button>
              ),
            }}
          />
        </Box>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {ignorePatterns.map((pattern) => (
            <Chip
              key={pattern}
              label={pattern}
              size="small"
              onDelete={() => onRemovePattern(pattern)}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default IgnorePatternsSection;

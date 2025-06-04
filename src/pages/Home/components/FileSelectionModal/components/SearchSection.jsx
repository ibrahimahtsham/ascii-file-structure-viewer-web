import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

function SearchSection({ searchInput, onSearchChange }) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search files and folders..."
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default SearchSection;

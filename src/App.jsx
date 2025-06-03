import { useState, useMemo } from "react";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { AccountTree } from "@mui/icons-material";
import ThemeToggle from "./components/ThemeToggle";
import Home from "./pages/Home";
import { darkTheme } from "./theme/darkTheme";
import { lightTheme } from "./theme/lightTheme";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <AccountTree sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ASCII File Structure Viewer
            </Typography>
            <ThemeToggle darkMode={darkMode} onToggle={handleThemeToggle} />
          </Toolbar>
        </AppBar>
        <Home />
      </Box>
    </ThemeProvider>
  );
}

export default App;

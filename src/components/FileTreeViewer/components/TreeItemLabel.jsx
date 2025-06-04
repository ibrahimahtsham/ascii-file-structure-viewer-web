import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Folder,
  VisibilityOff,
  Visibility,
  FolderOff,
} from "@mui/icons-material";
import { getFileIcon } from "../utils/fileIcons";

function TreeItemLabel({
  itemKey,
  value,
  itemId,
  isFile,
  isIgnored,
  onIgnoreToggle,
}) {
  const extension = isFile ? value.extension : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 0.5,
        opacity: isIgnored ? 0.5 : 1,
        textDecoration: isIgnored ? "line-through" : "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        {isFile ? (
          <Box sx={{ mr: 1, fontSize: 16 }}>{getFileIcon(extension)}</Box>
        ) : (
          <Folder
            sx={{
              mr: 1,
              fontSize: 16,
              color: isIgnored ? "text.disabled" : "warning.main",
            }}
          />
        )}
        <Typography
          variant="body2"
          sx={{
            color: isIgnored ? "text.disabled" : "text.primary",
          }}
        >
          {itemKey}
          {isFile && value.lines > 0 && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                ml: 1,
                opacity: 0.7,
                color:
                  value.lines > 1000
                    ? "error.main"
                    : value.lines > 500
                    ? "warning.main"
                    : value.lines > 100
                    ? "info.main"
                    : "success.main",
              }}
            >
              ({value.lines} lines)
            </Typography>
          )}
          {isFile && (
            <Typography
              component="span"
              variant="caption"
              sx={{ ml: 1, opacity: 0.6 }}
            >
              ({(value.size / 1024).toFixed(1)} KB)
            </Typography>
          )}
        </Typography>
      </Box>

      <Tooltip
        title={isIgnored ? "Include in ASCII tree" : "Exclude from ASCII tree"}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onIgnoreToggle(itemId);
          }}
          sx={{
            ml: 1,
            opacity: 0.7,
            "&:hover": { opacity: 1 },
          }}
        >
          {isIgnored ? (
            isFile ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <FolderOff fontSize="small" />
            )
          ) : (
            <Visibility fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default TreeItemLabel;

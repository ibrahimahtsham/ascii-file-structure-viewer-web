import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Folder, InsertDriveFile } from "@mui/icons-material";

function TreeItem({
  itemKey,
  item,
  level,
  isSelected,
  isAllSelected,
  isPartiallySelected,
  folderFileCount,
  onToggle,
}) {
  const isFile = item.type === "file";

  return (
    <ListItem sx={{ pl: level * 2 + (isFile ? 1 : 0) }}>
      <ListItemButton onClick={onToggle}>
        <ListItemIcon>
          <Checkbox
            checked={isFile ? isSelected : isAllSelected}
            indeterminate={!isFile && isPartiallySelected}
            size="small"
          />
        </ListItemIcon>
        <ListItemIcon>
          {isFile ? (
            <InsertDriveFile sx={{ fontSize: 16 }} />
          ) : (
            <Folder sx={{ fontSize: 16 }} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={itemKey}
          secondary={
            isFile
              ? `${(item.size / 1024).toFixed(1)} KB`
              : `${folderFileCount} files`
          }
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: isFile ? 400 : 500,
          }}
          secondaryTypographyProps={{ variant: "caption" }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default TreeItem;

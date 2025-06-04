import { Box } from "@mui/material";
import { TREE_STYLES } from "../utils/colorUtils";

function TreeDisplay({ content, showColors }) {
  return (
    <Box
      sx={{
        fontFamily: "monospace",
        fontSize: "0.75rem",
        lineHeight: 1.3,
        overflow: "auto",
        maxHeight: "500px",
        backgroundColor: "background.default",
        p: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        ...TREE_STYLES(showColors),
      }}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
}

export default TreeDisplay;

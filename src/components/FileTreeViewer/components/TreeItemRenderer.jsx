import { TreeItem } from "@mui/x-tree-view/TreeItem";
import TreeItemLabel from "./TreeItemLabel";

function TreeItemRenderer({ nodes, onIgnoreToggle, isItemIgnored, path = "" }) {
  return Object.entries(nodes).map(([key, value]) => {
    const itemId = path ? `${path}/${key}` : key;
    const isFile = value && value.name;
    const isIgnored = isItemIgnored(itemId);

    return (
      <TreeItem
        key={itemId}
        itemId={itemId}
        label={
          <TreeItemLabel
            itemKey={key}
            value={value}
            itemId={itemId}
            isFile={isFile}
            isIgnored={isIgnored}
            onIgnoreToggle={onIgnoreToggle}
          />
        }
      >
        {!isFile && (
          <TreeItemRenderer
            nodes={value}
            onIgnoreToggle={onIgnoreToggle}
            isItemIgnored={isItemIgnored}
            path={itemId}
          />
        )}
      </TreeItem>
    );
  });
}

export default TreeItemRenderer;

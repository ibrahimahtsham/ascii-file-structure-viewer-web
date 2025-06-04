import { useMemo } from "react";

export function useFileTree(files) {
  const fileTree = useMemo(() => {
    if (!files || files.length === 0) return {};

    const tree = {};
    files.forEach((file) => {
      const parts = file.webkitRelativePath.split("/");
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          if (index === parts.length - 1) {
            // It's a file
            current[part] = {
              type: "file",
              file: file,
              path: file.webkitRelativePath,
              size: file.size,
            };
          } else {
            // It's a folder
            current[part] = {
              type: "folder",
              children: {},
              path: parts.slice(0, index + 1).join("/"),
            };
          }
        }
        current = current[part].children || current[part];
      });
    });
    return tree;
  }, [files]);

  return { fileTree };
}

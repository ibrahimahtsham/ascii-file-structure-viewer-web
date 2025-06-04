export class TreeBuilder {
  buildTreeStructure(files) {
    const tree = {};

    files.forEach((file) => {
      const parts = file.path.split("/");
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? file : {};
        }
        current = current[part];
      });
    });

    return tree;
  }

  buildFlatStructure(files) {
    return files.reduce((acc, file) => {
      acc[file.path] = file;
      return acc;
    }, {});
  }

  getFilesByExtension(files) {
    return files.reduce((acc, file) => {
      const ext = file.extension || "no-extension";
      if (!acc[ext]) {
        acc[ext] = [];
      }
      acc[ext].push(file);
      return acc;
    }, {});
  }
}

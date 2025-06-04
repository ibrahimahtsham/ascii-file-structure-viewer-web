import { getMimeType } from "../utils/fileTypeUtils.js";

export class FileObjectCreator {
  constructor(repositoryFetcher) {
    this.repositoryFetcher = repositoryFetcher;
  }

  // Create file object without fetching content (for large files)
  async createFileObjectWithoutContent(githubFileItem) {
    const pathParts = githubFileItem.path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const fileObj = {
      name: fileName,
      size: githubFileItem.size || 0,
      type: getMimeType(fileName),
      lastModified: Date.now(),
      webkitRelativePath: githubFileItem.path,
      text: () => Promise.resolve(""),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      stream: () =>
        new ReadableStream({
          start(controller) {
            controller.close();
          },
        }),
      isGitHubFile: true,
      downloadUrl: githubFileItem.download_url,
      content: "",
    };

    return fileObj;
  }

  async createFileObject(githubFileItem) {
    const pathParts = githubFileItem.path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    let content = "";
    let size = githubFileItem.size || 0;

    if (size < 1024 * 1024) {
      try {
        content = await this.repositoryFetcher.fetchFileContent(
          githubFileItem.download_url
        );
        size = new Blob([content]).size;
      } catch {
        console.warn("Could not fetch content for:", githubFileItem.path);
      }
    }

    const fileObj = {
      name: fileName,
      size: size,
      type: getMimeType(fileName),
      lastModified: Date.now(),
      webkitRelativePath: githubFileItem.path,
      text: () => Promise.resolve(content),
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(content).buffer),
      stream: () =>
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(content));
            controller.close();
          },
        }),
      isGitHubFile: true,
      downloadUrl: githubFileItem.download_url,
      content: content,
    };

    return fileObj;
  }

  async createFileObjects(githubFileItems) {
    const fileObjects = [];

    for (const item of githubFileItems) {
      let fileObj;

      // For large files, skip fetching content
      if (item.size > 1024 * 1024) {
        // > 1MB
        fileObj = await this.createFileObjectWithoutContent(item);
      } else {
        fileObj = await this.createFileObject(item);
      }

      fileObjects.push(fileObj);
    }

    return fileObjects;
  }
}

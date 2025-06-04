export class GitHubAPI {
  constructor() {
    this.baseURL = "https://api.github.com";
  }

  parseRepositoryURL(url) {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/,
      /^([^/]+)\/([^/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2],
        };
      }
    }
    throw new Error("Invalid GitHub repository URL format");
  }

  async fetchRepositoryContents(owner, repo, path = "") {
    const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found or is private");
        }
        if (response.status === 403) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes("fetch")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async fetchFileContent(downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn("Failed to fetch file content:", error);
      return "";
    }
  }

  async fetchAllFiles(owner, repo, onProgress = null) {
    const allFiles = [];
    const processedPaths = new Set();

    const fetchRecursively = async (path = "", level = 0) => {
      if (level > 10) {
        // Prevent infinite recursion
        console.warn("Maximum depth reached, skipping:", path);
        return;
      }

      try {
        const contents = await this.fetchRepositoryContents(owner, repo, path);

        if (!Array.isArray(contents)) {
          return; // Single file, not a directory
        }

        for (const item of contents) {
          if (processedPaths.has(item.path)) {
            continue; // Skip already processed paths
          }
          processedPaths.add(item.path);

          if (item.type === "file") {
            // Convert GitHub API response to File-like object
            const fileObj = await this.createFileObject(item);
            allFiles.push(fileObj);

            if (onProgress) {
              onProgress(allFiles.length);
            }
          } else if (item.type === "dir") {
            await fetchRecursively(item.path, level + 1);
          }
        }
      } catch (error) {
        console.error(`Error fetching contents for path ${path}:`, error);
      }
    };

    await fetchRecursively();
    return allFiles;
  }

  async createFileObject(githubFileItem) {
    const pathParts = githubFileItem.path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    // Try to fetch file content for size and line count
    let content = "";
    let size = githubFileItem.size || 0;

    if (size < 1024 * 1024) {
      // Only fetch content for files < 1MB
      try {
        content = await this.fetchFileContent(githubFileItem.download_url);
        size = new Blob([content]).size;
      } catch {
        console.warn("Could not fetch content for:", githubFileItem.path);
      }
    }

    // Create a File-like object that matches the expected interface
    const fileObj = {
      name: fileName,
      size: size,
      type: this.getMimeType(fileName),
      lastModified: Date.now(),
      webkitRelativePath: githubFileItem.path,
      // Add methods to match File interface
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
      // Additional properties for GitHub integration
      isGitHubFile: true,
      downloadUrl: githubFileItem.download_url,
      content: content,
    };

    return fileObj;
  }

  getMimeType(filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes = {
      js: "text/javascript",
      jsx: "text/javascript",
      ts: "text/typescript",
      tsx: "text/typescript",
      json: "application/json",
      html: "text/html",
      css: "text/css",
      md: "text/markdown",
      txt: "text/plain",
      py: "text/x-python",
      java: "text/x-java-source",
    };
    return mimeTypes[ext] || "text/plain";
  }
}

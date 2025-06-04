export class GitHubAPI {
  constructor() {
    this.baseURL = "https://api.github.com";
    this.rateLimitInfo = {
      remaining: null,
      resetTime: null,
      limit: null,
    };
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  // Check rate limit status
  async checkRateLimit() {
    try {
      const response = await fetch(`${this.baseURL}/rate_limit`);
      if (response.ok) {
        const data = await response.json();
        this.rateLimitInfo = {
          remaining: data.rate.remaining,
          resetTime: new Date(data.rate.reset * 1000),
          limit: data.rate.limit,
        };
        return this.rateLimitInfo;
      }
    } catch (error) {
      console.warn("Could not check rate limit:", error);
    }
    return null;
  }

  // Wait for rate limit reset
  async waitForRateLimit() {
    if (this.rateLimitInfo.resetTime) {
      const waitTime = this.rateLimitInfo.resetTime.getTime() - Date.now();
      if (waitTime > 0) {
        console.log(
          `Rate limit exceeded. Waiting ${Math.ceil(
            waitTime / 1000
          )} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime + 1000)); // Add 1 second buffer
      }
    }
  }

  // Add delay between requests to avoid hitting rate limits
  async rateLimitedFetch(url, options = {}) {
    // Add delay between requests (GitHub allows 5000 requests per hour for authenticated users, 60 for unauthenticated)
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay between requests

    const response = await fetch(url, options);

    // Update rate limit info from response headers
    if (response.headers.has("x-ratelimit-remaining")) {
      this.rateLimitInfo.remaining = parseInt(
        response.headers.get("x-ratelimit-remaining")
      );
      this.rateLimitInfo.resetTime = new Date(
        parseInt(response.headers.get("x-ratelimit-reset")) * 1000
      );
      this.rateLimitInfo.limit = parseInt(
        response.headers.get("x-ratelimit-limit")
      );
    }

    // If we're getting close to the limit, add more delay
    if (
      this.rateLimitInfo.remaining !== null &&
      this.rateLimitInfo.remaining < 10
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay when close to limit
    }

    return response;
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
      const response = await this.rateLimitedFetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found or is private");
        }
        if (response.status === 403) {
          // Check if it's a rate limit issue
          const rateLimitRemaining = response.headers.get(
            "x-ratelimit-remaining"
          );
          if (rateLimitRemaining === "0") {
            const resetTime = new Date(
              parseInt(response.headers.get("x-ratelimit-reset")) * 1000
            );
            const waitMinutes = Math.ceil(
              (resetTime.getTime() - Date.now()) / (1000 * 60)
            );
            throw new Error(
              `GitHub rate limit exceeded. Please try again in ${waitMinutes} minutes.`
            );
          }
          throw new Error(
            "Rate limit exceeded or access forbidden. Please try again later."
          );
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
      const response = await this.rateLimitedFetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn("Failed to fetch file content:", error);
      return "";
    }
  }

  async fetchAllFiles(owner, repo, onProgress = null, onRateLimit = null) {
    // Check initial rate limit
    await this.checkRateLimit();

    if (
      this.rateLimitInfo.remaining !== null &&
      this.rateLimitInfo.remaining < 50
    ) {
      if (onRateLimit) {
        onRateLimit(this.rateLimitInfo);
      }
      throw new Error(
        `Rate limit too low (${this.rateLimitInfo.remaining} requests remaining). Please try again later.`
      );
    }

    const allFiles = [];
    const processedPaths = new Set();
    let requestCount = 0;

    const fetchRecursively = async (path = "", level = 0) => {
      if (level > 10) {
        console.warn("Maximum depth reached, skipping:", path);
        return;
      }

      // Check rate limit every 10 requests
      if (requestCount % 10 === 0 && requestCount > 0) {
        if (
          this.rateLimitInfo.remaining !== null &&
          this.rateLimitInfo.remaining < 10
        ) {
          if (onRateLimit) {
            onRateLimit(this.rateLimitInfo);
          }
          throw new Error(
            `Approaching rate limit (${this.rateLimitInfo.remaining} requests remaining). Stopping to avoid exceeding limit.`
          );
        }
      }

      try {
        requestCount++;
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
            // For large repositories, skip fetching content for very large files
            if (item.size > 1024 * 1024) {
              // > 1MB
              const fileObj = await this.createFileObjectWithoutContent(item);
              allFiles.push(fileObj);
            } else {
              const fileObj = await this.createFileObject(item);
              allFiles.push(fileObj);
            }

            if (onProgress) {
              onProgress(allFiles.length, this.rateLimitInfo);
            }
          } else if (item.type === "dir") {
            await fetchRecursively(item.path, level + 1);
          }
        }
      } catch (error) {
        if (
          error.message.includes("rate limit") ||
          error.message.includes("Rate limit")
        ) {
          throw error; // Re-throw rate limit errors
        }
        console.error(`Error fetching contents for path ${path}:`, error);
      }
    };

    await fetchRecursively();
    return allFiles;
  }

  // Create file object without fetching content (for large files)
  async createFileObjectWithoutContent(githubFileItem) {
    const pathParts = githubFileItem.path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const fileObj = {
      name: fileName,
      size: githubFileItem.size || 0,
      type: this.getMimeType(fileName),
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
        content = await this.fetchFileContent(githubFileItem.download_url);
        size = new Blob([content]).size;
      } catch {
        console.warn("Could not fetch content for:", githubFileItem.path);
      }
    }

    const fileObj = {
      name: fileName,
      size: size,
      type: this.getMimeType(fileName),
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

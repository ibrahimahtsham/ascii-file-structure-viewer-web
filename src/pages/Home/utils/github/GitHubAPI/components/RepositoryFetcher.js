import { parseRepositoryURL, handleAPIError } from "../utils/apiUtils.js";

export class RepositoryFetcher {
  constructor(rateLimitManager, baseURL) {
    this.rateLimitManager = rateLimitManager;
    this.baseURL = baseURL;
  }

  async fetchRepositoryContents(owner, repo, path = "") {
    const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;

    try {
      const response = await this.rateLimitManager.rateLimitedFetch(url);

      if (!response.ok) {
        throw handleAPIError(response);
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
      const response = await this.rateLimitManager.rateLimitedFetch(
        downloadUrl
      );
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
    // Validate repository URL first
    const repoInfo = parseRepositoryURL(`${owner}/${repo}`);
    if (!repoInfo) {
      throw new Error("Invalid repository format");
    }

    // Check initial rate limit
    await this.rateLimitManager.checkRateLimit(this.baseURL);

    if (this.rateLimitManager.isApproachingLimit(50)) {
      if (onRateLimit) {
        onRateLimit(this.rateLimitManager.rateLimitInfo);
      }
      throw new Error(
        `Rate limit too low (${this.rateLimitManager.rateLimitInfo.remaining} requests remaining). Please try again later.`
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
        if (this.rateLimitManager.isApproachingLimit(10)) {
          if (onRateLimit) {
            onRateLimit(this.rateLimitManager.rateLimitInfo);
          }
          throw new Error(
            `Approaching rate limit (${this.rateLimitManager.rateLimitInfo.remaining} requests remaining). Stopping to avoid exceeding limit.`
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
            allFiles.push(item);

            if (onProgress) {
              onProgress(allFiles.length, this.rateLimitManager.rateLimitInfo);
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
}

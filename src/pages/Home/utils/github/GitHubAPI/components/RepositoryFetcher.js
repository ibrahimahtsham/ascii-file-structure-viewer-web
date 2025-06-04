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
        throw handleAPIError(
          response,
          this.rateLimitManager.getRateLimitDetails()
        );
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

    // Check initial rate limit with detailed feedback
    await this.rateLimitManager.checkRateLimit(this.baseURL);
    const rateLimitDetails = this.rateLimitManager.getRateLimitDetails();

    if (!rateLimitDetails.canProceed) {
      if (onRateLimit) {
        onRateLimit(rateLimitDetails);
      }
      throw this.rateLimitManager.createRateLimitError();
    }

    // Warn if rate limit is low
    if (rateLimitDetails.status === "warning" && onRateLimit) {
      onRateLimit(rateLimitDetails);
    }

    const allFiles = [];
    const processedPaths = new Set();
    let requestCount = 0;

    const fetchRecursively = async (path = "", level = 0) => {
      if (level > 10) {
        console.warn("Maximum depth reached, skipping:", path);
        return;
      }

      // Check rate limit every 5 requests instead of 10 for better monitoring
      if (requestCount % 5 === 0 && requestCount > 0) {
        const currentRateLimit = this.rateLimitManager.getRateLimitDetails();

        if (!currentRateLimit.canProceed) {
          if (onRateLimit) {
            onRateLimit(currentRateLimit);
          }
          throw this.rateLimitManager.createRateLimitError();
        }

        // Update progress with rate limit info
        if (onProgress) {
          onProgress(allFiles.length, currentRateLimit);
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
              onProgress(
                allFiles.length,
                this.rateLimitManager.getRateLimitDetails()
              );
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

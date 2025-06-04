import { RateLimitManager } from "./components/RateLimitManager.js";
import { RepositoryFetcher } from "./components/RepositoryFetcher.js";
import { FileObjectCreator } from "./components/FileObjectCreator.js";
import { validateRepositoryInput } from "./utils/apiUtils.js";

export class GitHubAPI {
  constructor() {
    this.baseURL = "https://api.github.com";
    this.rateLimitManager = new RateLimitManager();
    this.repositoryFetcher = new RepositoryFetcher(
      this.rateLimitManager,
      this.baseURL
    );
    this.fileObjectCreator = new FileObjectCreator(this.repositoryFetcher);
  }

  parseRepositoryURL(url) {
    return validateRepositoryInput(url);
  }

  async checkRateLimit() {
    return this.rateLimitManager.checkRateLimit(this.baseURL);
  }

  async fetchAllFiles(owner, repo, onProgress = null, onRateLimit = null) {
    // Fetch raw GitHub file items
    const githubFileItems = await this.repositoryFetcher.fetchAllFiles(
      owner,
      repo,
      onProgress,
      onRateLimit
    );

    // Convert to File objects
    const fileObjects = await this.fileObjectCreator.createFileObjects(
      githubFileItems
    );

    return fileObjects;
  }

  // Legacy methods for backward compatibility
  async fetchRepositoryContents(owner, repo, path = "") {
    return this.repositoryFetcher.fetchRepositoryContents(owner, repo, path);
  }

  async fetchFileContent(downloadUrl) {
    return this.repositoryFetcher.fetchFileContent(downloadUrl);
  }

  async createFileObject(githubFileItem) {
    return this.fileObjectCreator.createFileObject(githubFileItem);
  }

  async createFileObjectWithoutContent(githubFileItem) {
    return this.fileObjectCreator.createFileObjectWithoutContent(
      githubFileItem
    );
  }

  getMimeType(filename) {
    return this.fileObjectCreator.getMimeType(filename);
  }

  // Get rate limit status
  getRateLimitStatus() {
    return this.rateLimitManager.getRateLimitStatus();
  }
}

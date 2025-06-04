export class RateLimitManager {
  constructor() {
    this.rateLimitInfo = {
      remaining: null,
      resetTime: null,
      limit: null,
      used: null,
      resource: "core",
    };
  }

  // Check rate limit status with detailed information
  async checkRateLimit(baseURL) {
    try {
      const response = await fetch(`${baseURL}/rate_limit`);
      if (response.ok) {
        const data = await response.json();
        this.rateLimitInfo = {
          remaining: data.rate.remaining,
          resetTime: new Date(data.rate.reset * 1000),
          limit: data.rate.limit,
          used: data.rate.used,
          resource: "core",
        };
        return this.rateLimitInfo;
      }
    } catch (error) {
      console.warn("Could not check rate limit:", error);
    }
    return null;
  }

  // Get detailed rate limit status for UI
  getRateLimitDetails() {
    if (this.rateLimitInfo.remaining === null) {
      return {
        status: "unknown",
        message: "Rate limit status unknown",
        canProceed: true,
        timeUntilReset: null,
        percentage: null,
      };
    }

    const now = Date.now();
    const resetTime = this.rateLimitInfo.resetTime?.getTime() || now;
    const timeUntilReset = Math.max(0, resetTime - now);
    const percentage =
      this.rateLimitInfo.limit > 0
        ? (this.rateLimitInfo.remaining / this.rateLimitInfo.limit) * 100
        : 0;

    let status, message, canProceed;

    if (this.rateLimitInfo.remaining === 0) {
      status = "exceeded";
      message = `Rate limit exceeded. ${this.formatTimeUntilReset(
        timeUntilReset
      )}`;
      canProceed = false;
    } else if (this.rateLimitInfo.remaining < 10) {
      status = "critical";
      message = `Very low rate limit (${this.rateLimitInfo.remaining} requests remaining)`;
      canProceed = false;
    } else if (this.rateLimitInfo.remaining < 50) {
      status = "warning";
      message = `Low rate limit (${this.rateLimitInfo.remaining} requests remaining)`;
      canProceed = true;
    } else {
      status = "good";
      message = `${this.rateLimitInfo.remaining} requests remaining`;
      canProceed = true;
    }

    return {
      status,
      message,
      canProceed,
      timeUntilReset,
      percentage,
      remaining: this.rateLimitInfo.remaining,
      limit: this.rateLimitInfo.limit,
      used: this.rateLimitInfo.used,
      resetTime: this.rateLimitInfo.resetTime,
    };
  }

  formatTimeUntilReset(milliseconds) {
    if (milliseconds <= 0) return "Rate limit should reset now";

    const minutes = Math.ceil(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `Try again in ${hours}h ${remainingMinutes}m`;
    } else {
      return `Try again in ${minutes} minutes`;
    }
  }

  // Enhanced error creation with detailed information
  createRateLimitError() {
    const details = this.getRateLimitDetails();

    if (details.status === "exceeded") {
      return new Error(
        `GitHub API rate limit exceeded (${details.used}/${details.limit} requests used). ${details.message}`
      );
    } else if (details.status === "critical") {
      return new Error(
        `GitHub API rate limit critically low (${details.remaining}/${details.limit} remaining). Please wait before making more requests.`
      );
    } else {
      return new Error(
        `GitHub API rate limit insufficient for this operation (${details.remaining} remaining).`
      );
    }
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
        await new Promise((resolve) => setTimeout(resolve, waitTime + 1000));
      }
    }
  }

  // Enhanced rate limited fetch with better error handling
  async rateLimitedFetch(url, options = {}) {
    // Add delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await fetch(url, options);

    // Update rate limit info from response headers
    this.updateFromHeaders(response.headers);

    // If we're getting close to the limit, add more delay
    if (
      this.rateLimitInfo.remaining !== null &&
      this.rateLimitInfo.remaining < 10
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return response;
  }

  updateFromHeaders(headers) {
    if (headers.has("x-ratelimit-remaining")) {
      this.rateLimitInfo.remaining = parseInt(
        headers.get("x-ratelimit-remaining")
      );
      this.rateLimitInfo.resetTime = new Date(
        parseInt(headers.get("x-ratelimit-reset")) * 1000
      );
      this.rateLimitInfo.limit = parseInt(headers.get("x-ratelimit-limit"));
      this.rateLimitInfo.used =
        this.rateLimitInfo.limit - this.rateLimitInfo.remaining;
    }
  }

  // Check if we're approaching rate limit
  isApproachingLimit(threshold = 10) {
    return (
      this.rateLimitInfo.remaining !== null &&
      this.rateLimitInfo.remaining < threshold
    );
  }

  // Get formatted rate limit info for display
  getRateLimitStatus() {
    const details = this.getRateLimitDetails();
    return `${details.remaining || "Unknown"}/${
      details.limit || "Unknown"
    } requests remaining (resets at ${
      details.resetTime?.toLocaleTimeString() || "Unknown"
    })`;
  }
}

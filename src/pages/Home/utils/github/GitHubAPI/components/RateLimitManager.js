export class RateLimitManager {
  constructor() {
    this.rateLimitInfo = {
      remaining: null,
      resetTime: null,
      limit: null,
    };
  }

  // Check rate limit status
  async checkRateLimit(baseURL) {
    try {
      const response = await fetch(`${baseURL}/rate_limit`);
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

  // Check if we're approaching rate limit
  isApproachingLimit(threshold = 10) {
    return (
      this.rateLimitInfo.remaining !== null &&
      this.rateLimitInfo.remaining < threshold
    );
  }

  // Get formatted rate limit info
  getRateLimitStatus() {
    if (this.rateLimitInfo.remaining === null) {
      return "Rate limit status unknown";
    }

    const resetTime = this.rateLimitInfo.resetTime
      ? this.rateLimitInfo.resetTime.toLocaleTimeString()
      : "Unknown";

    return `${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit} requests remaining (resets at ${resetTime})`;
  }
}

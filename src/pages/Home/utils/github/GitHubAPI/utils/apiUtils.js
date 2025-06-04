export function parseRepositoryURL(url) {
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
  return null;
}

export function handleAPIError(response, rateLimitDetails = null) {
  if (response.status === 404) {
    return new Error(
      "Repository not found or is private. Please check the repository URL and ensure it's publicly accessible."
    );
  }

  if (response.status === 403) {
    // Check if it's a rate limit issue
    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    const rateLimitReset = response.headers.get("x-ratelimit-reset");

    if (rateLimitRemaining === "0") {
      const resetTime = new Date(parseInt(rateLimitReset) * 1000);
      const waitMinutes = Math.ceil(
        (resetTime.getTime() - Date.now()) / (1000 * 60)
      );

      return new Error(
        `GitHub API rate limit exceeded (0 requests remaining). Your rate limit will reset at ${resetTime.toLocaleTimeString()}. Please try again in ${waitMinutes} minutes.`
      );
    }

    if (rateLimitDetails && !rateLimitDetails.canProceed) {
      return new Error(
        `GitHub API rate limit too low (${rateLimitDetails.remaining} requests remaining). ${rateLimitDetails.message}`
      );
    }

    return new Error(
      "Access forbidden. This might be due to rate limiting or repository permissions."
    );
  }

  if (response.status >= 500) {
    return new Error(
      `GitHub server error (${response.status}). Please try again later.`
    );
  }

  return new Error(
    `GitHub API error (${response.status}): ${
      response.statusText || "Unknown error"
    }`
  );
}

export function validateRepositoryInput(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Repository input must be a non-empty string");
  }

  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Repository input cannot be empty");
  }

  const parsed = parseRepositoryURL(trimmed);
  if (!parsed) {
    throw new Error(
      "Invalid GitHub repository URL format. Use formats like 'owner/repo' or 'https://github.com/owner/repo'"
    );
  }

  return parsed;
}

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

export function handleAPIError(response) {
  if (response.status === 404) {
    return new Error("Repository not found or is private");
  }

  if (response.status === 403) {
    // Check if it's a rate limit issue
    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    if (rateLimitRemaining === "0") {
      const resetTime = new Date(
        parseInt(response.headers.get("x-ratelimit-reset")) * 1000
      );
      const waitMinutes = Math.ceil(
        (resetTime.getTime() - Date.now()) / (1000 * 60)
      );
      return new Error(
        `GitHub rate limit exceeded. Please try again in ${waitMinutes} minutes.`
      );
    }
    return new Error(
      "Rate limit exceeded or access forbidden. Please try again later."
    );
  }

  return new Error(`GitHub API error: ${response.status}`);
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
    throw new Error("Invalid GitHub repository URL format");
  }

  return parsed;
}

export const RATE_LIMIT_CONSTANTS = {
  UNAUTHENTICATED_LIMIT: 60,
  AUTHENTICATED_LIMIT: 5000,
  DEFAULT_DELAY: 100, // ms between requests
  CLOSE_TO_LIMIT_DELAY: 1000, // ms when close to limit
  CLOSE_TO_LIMIT_THRESHOLD: 10,
  MINIMUM_REQUIRED_REQUESTS: 50,
};

export function calculateOptimalDelay(remaining, limit) {
  if (remaining === null || limit === null) {
    return RATE_LIMIT_CONSTANTS.DEFAULT_DELAY;
  }

  const percentage = remaining / limit;

  if (percentage < 0.1) {
    // Less than 10% remaining
    return RATE_LIMIT_CONSTANTS.CLOSE_TO_LIMIT_DELAY;
  } else if (percentage < 0.2) {
    // Less than 20% remaining
    return RATE_LIMIT_CONSTANTS.DEFAULT_DELAY * 2;
  }

  return RATE_LIMIT_CONSTANTS.DEFAULT_DELAY;
}

export function formatRateLimitError(rateLimitInfo) {
  if (!rateLimitInfo.resetTime) {
    return "Rate limit exceeded. Please try again later.";
  }

  const waitMinutes = Math.ceil(
    (rateLimitInfo.resetTime.getTime() - Date.now()) / (1000 * 60)
  );

  return `GitHub rate limit exceeded. Please try again in ${waitMinutes} minutes.`;
}

export function shouldStopDueToRateLimit(
  rateLimitInfo,
  threshold = RATE_LIMIT_CONSTANTS.CLOSE_TO_LIMIT_THRESHOLD
) {
  return (
    rateLimitInfo.remaining !== null && rateLimitInfo.remaining < threshold
  );
}

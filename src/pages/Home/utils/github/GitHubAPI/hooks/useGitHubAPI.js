import { useState, useCallback, useRef } from "react";
import { GitHubAPI } from "../GitHubAPI.js";

export const useGitHubAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const githubAPIRef = useRef(null);

  // Initialize API instance
  const getAPIInstance = useCallback(() => {
    if (!githubAPIRef.current) {
      githubAPIRef.current = new GitHubAPI();
    }
    return githubAPIRef.current;
  }, []);

  const fetchRepository = useCallback(
    async (repoUrl, onProgress = null) => {
      setLoading(true);
      setError(null);

      try {
        const api = getAPIInstance();
        const { owner, repo } = api.parseRepositoryURL(repoUrl);

        const files = await api.fetchAllFiles(
          owner,
          repo,
          (count, rateLimitInfo) => {
            setRateLimitInfo(rateLimitInfo);
            if (onProgress) {
              onProgress(count, rateLimitInfo);
            }
          },
          (rateLimitInfo) => {
            setRateLimitInfo(rateLimitInfo);
          }
        );

        return files;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAPIInstance]
  );

  const checkRateLimit = useCallback(async () => {
    try {
      const api = getAPIInstance();
      const info = await api.checkRateLimit();
      setRateLimitInfo(info);
      return info;
    } catch (err) {
      console.warn("Failed to check rate limit:", err);
      return null;
    }
  }, [getAPIInstance]);

  const parseRepositoryURL = useCallback(
    (url) => {
      try {
        const api = getAPIInstance();
        return api.parseRepositoryURL(url);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [getAPIInstance]
  );

  return {
    loading,
    error,
    rateLimitInfo,
    fetchRepository,
    checkRateLimit,
    parseRepositoryURL,
    clearError: () => setError(null),
  };
};

"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 */
// ⚡ Bolt: Global in-memory cache for API responses to enable SWR
const apiCache = new Map();

export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Derive state from props to handle dynamic cacheKey changes safely
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Initialize with cached data if available for instant display
  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  });

  // Only show loading initially if we don't have a cache hit
  const [loading, setLoading] = useState(() => !(cacheKey && apiCache.has(cacheKey)));
  const [error, setError] = useState(null);

  // Update state synchronously when cacheKey changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const hasCache = cacheKey && apiCache.has(cacheKey);
    setData(hasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!hasCache);
    setError(null);
  }

  const fetch = useCallback(async (options = { force: false }) => {
    // Determine if we need to show loading UI
    const isCacheHit = cacheKey && apiCache.has(cacheKey);
    if (!isCacheHit || options.force) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await apiFn();

      // Update cache
      if (cacheKey) {
        apiCache.set(cacheKey, result);
      }

      setData(result);
    } catch (err) {
      console.error("[useApi]", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    // Include cacheKey to ensure fresh closures if it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey]);

  useEffect(() => {
    // ⚡ Bolt: Fetch handles background SWR transparently
    fetch();
  }, [fetch]);

  // ⚡ Bolt: Expose refetch that forces a fresh request bypassing cache
  const refetch = useCallback(() => fetch({ force: true }), [fetch]);

  return { data, loading, error, refetch };
}

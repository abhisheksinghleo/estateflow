"use client";

import { useState, useEffect, useCallback } from "react";

// Global in-memory cache for API responses
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Implements SWR (Stale-While-Revalidate) if a cacheKey is provided.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to enable caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Initialize state based on cache existence
  const hasCachedData = cacheKey ? apiCache.has(cacheKey) : false;
  const initialData = hasCachedData ? apiCache.get(cacheKey) : fallback;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasCachedData);
  const [error, setError] = useState(null);

  // Synchronize state during render if cacheKey changes
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const hasNewCachedData = cacheKey ? apiCache.has(cacheKey) : false;
    setData(hasNewCachedData ? apiCache.get(cacheKey) : fallback);
    setLoading(!hasNewCachedData);
    setError(null);
  }

  const fetch = useCallback(async (options = { force: false }) => {
    // If we have a cache hit and we're not forcing a refetch,
    // we don't set loading to true, providing a snappy SWR experience.
    const isCacheHit = cacheKey && apiCache.has(cacheKey);

    if (!isCacheHit || options.force) {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await apiFn();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Expose a refetch function that forces a bypass of the cache.
  const refetch = useCallback(() => fetch({ force: true }), [fetch]);

  return { data, loading, error, refetch };
}

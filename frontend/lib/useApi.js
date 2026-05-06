"use client";

import { useState, useEffect, useCallback } from "react";

// Global in-memory cache for API responses (Stale-While-Revalidate pattern)
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Now includes SWR (Stale-While-Revalidate) caching to prevent redundant fetching
 * and eliminate unnecessary loading states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {String}   cacheKey - Optional key to identify the cache entry
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Initialize from cache if available to prevent initial loading state flash
  const initialData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback;
  const initialLoading = cacheKey && apiCache.has(cacheKey) ? false : true;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  // Track the current cacheKey to handle dynamic route changes without unmounting
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derived state pattern: update state immediately if cacheKey changes (e.g., dynamic route navigation)
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const cachedData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback;
    setData(cachedData);
    setLoading(cacheKey && apiCache.has(cacheKey) ? false : true);
    setError(null);
  }

  const fetch = useCallback(async () => {
    // Only show loading state if we don't have cached data
    if (!cacheKey || !apiCache.has(cacheKey)) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await apiFn();

      // Update cache with fresh data
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
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

"use client";

import { useState, useEffect, useCallback } from "react";

// In-memory cache for SWR pattern
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {String}   cacheKey - Optional cache key for SWR pattern
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Sync state for dynamic route changes without unmounting
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Determine if we have cached data for the current key
  const hasCachedData = cacheKey ? apiCache.has(cacheKey) : false;
  const initialData = hasCachedData ? apiCache.get(cacheKey) : fallback;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasCachedData);
  const [error, setError] = useState(null);

  // If the cache key changes during render (e.g. dynamic route change),
  // update the state synchronously to avoid showing old data.
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const newHasCachedData = cacheKey ? apiCache.has(cacheKey) : false;
    setData(newHasCachedData ? apiCache.get(cacheKey) : fallback);
    setLoading(!newHasCachedData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

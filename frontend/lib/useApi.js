"use client";

import { useState, useEffect, useCallback } from "react";

// Global in-memory cache for Stale-While-Revalidate (SWR)
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional string to enable SWR cache and prevent redundant fetching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const cachedData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : null;

  const [data, setData] = useState(cachedData || fallback);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derive state during render to handle dynamic route changes without unmounting
  if (cacheKey !== currentCacheKey) {
    const newCachedData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : null;
    setData(newCachedData || fallback);
    setLoading(!newCachedData);
    setError(null);
    setCurrentCacheKey(cacheKey);
  }

  const fetch = useCallback(async (force = false) => {
    // If we have cached data, don't set loading to true (SWR pattern), unless forced or not cached
    if (!cacheKey || !apiCache.has(cacheKey) || force) {
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
  }, [cacheKey, ...deps]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: () => fetch(true) };
}

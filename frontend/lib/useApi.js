"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to cache the API response (enables SWR pattern)
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  });

  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return false;
    }
    return true;
  });

  const [error, setError] = useState(null);

  // Derive state during render when cacheKey changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const hasCache = cacheKey && apiCache.has(cacheKey);
    setData(hasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!hasCache);
    setError(null);
  }

  const fetch = useCallback(async () => {
    // If we don't have cached data for this key, set loading to true
    if (!cacheKey || !apiCache.has(cacheKey)) {
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

  return { data, loading, error, refetch: fetch };
}

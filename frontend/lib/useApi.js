"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to use for SWR caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const hasCache = cacheKey && apiCache.has(cacheKey);
  const initialData = hasCache ? apiCache.get(cacheKey) : fallback;
  const initialLoading = !hasCache;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derive state during render for dynamic route changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const cachedData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback;
    setData(cachedData);
    setLoading(!(cacheKey && apiCache.has(cacheKey)));
    setError(null);
  }

  const fetch = useCallback(async () => {
    // For SWR, if we have cached data, don't set loading to true
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
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

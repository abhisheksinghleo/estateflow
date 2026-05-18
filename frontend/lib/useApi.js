"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key for SWR caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const hasCache = cacheKey && apiCache.has(cacheKey);
  const [data, setData] = useState(hasCache ? apiCache.get(cacheKey) : fallback);
  const [loading, setLoading] = useState(!hasCache);
  const [error, setError] = useState(null);
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Synchronize state during render when cacheKey changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const newHasCache = cacheKey && apiCache.has(cacheKey);
    setData(newHasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!newHasCache);
    setError(null);
  }

  const fetch = useCallback(async () => {
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

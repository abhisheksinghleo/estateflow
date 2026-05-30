"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key for in-memory caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) return apiCache.get(cacheKey);
    return fallback;
  });
  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) return false;
    return true;
  });
  const [error, setError] = useState(null);

  // Synchronize state during render to handle dynamic route changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    if (cacheKey && apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
      setLoading(false);
      setError(null);
    } else {
      setData(fallback);
      setLoading(true);
      setError(null);
    }
  }

  const fetch = useCallback(async (options = { force: false }) => {
    if (cacheKey && !options?.force && apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
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

  // Ensure refetch explicitly bypasses cache
  const refetch = useCallback(() => fetch({ force: true }), [fetch]);

  return { data, loading, error, refetch };
}

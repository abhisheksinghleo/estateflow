"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key to prevent redundant network fetching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const hasInitialCache = cacheKey && apiCache.has(cacheKey);
  const [data, setData] = useState(hasInitialCache ? apiCache.get(cacheKey) : fallback);
  const [loading, setLoading] = useState(hasInitialCache ? false : true);
  const [error, setError] = useState(null);
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derive state from props during render
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const hasCache = cacheKey && apiCache.has(cacheKey);
    setData(hasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!hasCache);
    setError(null);
  }

  const fetch = useCallback(async (options = { force: false }) => {
    if (!options?.force && cacheKey && apiCache.has(cacheKey)) {
      return; // Early return on cache hit
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

  return {
    data,
    loading,
    error,
    refetch: useCallback((options) => fetch({ force: true, ...options }), [fetch])
  };
}

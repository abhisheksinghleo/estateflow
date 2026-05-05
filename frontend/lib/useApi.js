"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key for SWR fetching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Try to find cached data synchronously so first render has it
  const initialData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback;
  const initialLoading = cacheKey && apiCache.has(cacheKey) ? false : true;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  // We need to store the current cacheKey to detect changes via derived state
  // This is required because if the component doesn't unmount (e.g., dynamic routing params change),
  // we need to reset the state instantly.
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // If cacheKey changed, sync the state immediately during render
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const newInitialData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback;
    const newInitialLoading = cacheKey && apiCache.has(cacheKey) ? false : true;
    setData(newInitialData);
    setLoading(newInitialLoading);
    setError(null);
  }

  const fetch = useCallback(async () => {
    // If we have cached data, we just revalidate silently (stale-while-revalidate)
    // If no cache, we show loading state
    const hasCache = cacheKey && apiCache.has(cacheKey);
    if (!hasCache) {
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
      if (!hasCache) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

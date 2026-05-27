"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to cache the API response
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Synchronize the React state correctly during render when using cacheKey
  const initialData = cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback;
  const initialLoading = cacheKey && apiCache.has(cacheKey) ? false : true;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  // Track previous cache key to derive state from props during render for dynamic route changes
  const [prevCacheKey, setPrevCacheKey] = useState(cacheKey);

  if (cacheKey !== prevCacheKey) {
    const isCached = cacheKey && apiCache.has(cacheKey);
    setData(isCached ? apiCache.get(cacheKey) : fallback);
    setLoading(!isCached);
    setError(null);
    setPrevCacheKey(cacheKey);
  }

  const fetch = useCallback(async (options = {}) => {
    const { force = false } = options;
    if (!force && cacheKey && apiCache.has(cacheKey)) {
      // Early return on cache hit to truly prevent redundant background network fetching
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

  return { data, loading, error, refetch: fetch };
}

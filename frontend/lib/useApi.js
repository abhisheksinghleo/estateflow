"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Uses an in-memory SWR (Stale-While-Revalidate) cache to prevent redundant fetching.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key for SWR caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) return apiCache.get(cacheKey);
    return fallback;
  });
  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) return false;
    return true;
  });
  const [error, setError] = useState(null);

  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    if (cacheKey && apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
      setLoading(false);
    } else {
      setData(fallback);
      setLoading(true);
    }
    setError(null);
  }

  const fetch = useCallback(async () => {
    setLoading(!cacheKey || !apiCache.has(cacheKey));
    setError(null);
    try {
      const result = await apiFn();
      if (cacheKey) apiCache.set(cacheKey, result);
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

  return { data, loading, error, refetch: fetch };
}

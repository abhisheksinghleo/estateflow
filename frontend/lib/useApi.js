"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Implements SWR (Stale-While-Revalidate) caching strategy.
 *
 * @param {Function} apiFn    - Async function that returns data
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading
 * @param {string}   cacheKey - Optional key for in-memory caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);
  const isKeyChanged = cacheKey !== currentCacheKey;

  const hasCache = cacheKey && apiCache.has(cacheKey);

  const [data, setData] = useState(() => hasCache ? apiCache.get(cacheKey) : fallback);
  const [loading, setLoading] = useState(() => !hasCache);
  const [error, setError] = useState(null);

  // Derive state from props during render (handles dynamic route changes without unmounting)
  if (isKeyChanged) {
    setCurrentCacheKey(cacheKey);
    setData(hasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!hasCache);
    setError(null);
  }

  const fetch = useCallback(async () => {
    // Only set loading if we don't have cached data to show (SWR behavior)
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

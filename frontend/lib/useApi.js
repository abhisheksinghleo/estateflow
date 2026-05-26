"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to cache the response and prevent redundant fetching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const hasCache = cacheKey && apiCache.has(cacheKey);

  const [data, setData] = useState(hasCache ? apiCache.get(cacheKey) : fallback);
  const [loading, setLoading] = useState(!hasCache);
  const [error, setError] = useState(null);

  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  if (cacheKey !== currentCacheKey) {
    const nextHasCache = cacheKey && apiCache.has(cacheKey);
    setData(nextHasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!nextHasCache);
    setError(null);
    setCurrentCacheKey(cacheKey);
  }

  const fetch = useCallback(async (ignoreCache = false) => {
    if (!cacheKey || !apiCache.has(cacheKey) || ignoreCache) {
      setLoading(true);
    } else {
      // Early return to prevent redundant fetching if already cached
      return;
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

  const refetch = useCallback(() => fetch(true), [fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

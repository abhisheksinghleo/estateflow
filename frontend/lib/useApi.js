"use client";

import { useState, useEffect, useCallback } from "react";

const cache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to cache data in-memory (SWR pattern)
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  const [data, setData] = useState(() => {
    if (cacheKey && cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    return fallback;
  });

  const [loading, setLoading] = useState(() => !(cacheKey && cache.has(cacheKey)));

  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    if (cacheKey && cache.has(cacheKey)) {
      setData(cache.get(cacheKey));
      setLoading(false);
    } else {
      setData(fallback);
      setLoading(true);
    }
  }

  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!cacheKey || !cache.has(cacheKey)) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await apiFn();
      if (cacheKey) {
        cache.set(cacheKey, result);
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

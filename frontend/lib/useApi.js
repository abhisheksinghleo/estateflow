"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key for SWR
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [prevCacheKey, setPrevCacheKey] = useState(cacheKey);
  const [data, setData] = useState(() => (cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback));
  const [loading, setLoading] = useState(() => !(cacheKey && apiCache.has(cacheKey)));
  const [error, setError] = useState(null);

  // Sync state during render to properly handle dynamic route changes
  if (cacheKey !== prevCacheKey) {
    setPrevCacheKey(cacheKey);
    setData(cacheKey && apiCache.has(cacheKey) ? apiCache.get(cacheKey) : fallback);
    setLoading(!(cacheKey && apiCache.has(cacheKey)));
    setError(null);
  }

  const fetch = useCallback(async () => {
    if (!(cacheKey && apiCache.has(cacheKey))) {
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

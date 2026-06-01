"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Implements a stale-while-revalidate caching strategy.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {String}   cacheKey - Optional string to cache the API response
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  });

  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return false;
    }
    return true;
  });

  const [error, setError] = useState(null);

  const prevCacheKey = useRef(cacheKey);

  // Derive state safely if the cache key changes
  if (cacheKey !== prevCacheKey.current) {
    prevCacheKey.current = cacheKey;
    if (cacheKey && apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
      setLoading(false);
    } else {
      setData(fallback);
      setLoading(true);
    }
    setError(null);
  }

  const fetch = useCallback(async (options = {}) => {
    // If it's a force fetch, show loading indicator again
    if (options?.force || !(cacheKey && apiCache.has(cacheKey))) {
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
    // SWR: Fetch in background. `loading` is initially false if cache hit,
    // so this happens silently.
    fetch({ revalidate: true });
  }, [fetch]);

  return { data, loading, error, refetch: (opts = {force: true}) => fetch(opts) };
}

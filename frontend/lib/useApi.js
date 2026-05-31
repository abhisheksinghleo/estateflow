"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key to prevent redundant background network fetching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Determine initial state based on cache presence to avoid flash of loading
  const hasCache = cacheKey && apiCache.has(cacheKey);
  const initialData = hasCache ? apiCache.get(cacheKey) : fallback;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasCache);
  const [error, setError] = useState(null);

  // Sync state with cache if cacheKey changes (e.g. dynamic route changes)
  const prevCacheKey = useRef(cacheKey);
  if (cacheKey !== prevCacheKey.current) {
    prevCacheKey.current = cacheKey;
    const newHasCache = cacheKey && apiCache.has(cacheKey);
    setData(newHasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!newHasCache);
    setError(null);
  }

  const fetch = useCallback(async (options = {}) => {
    const force = options?.force || false;

    // Early return on cache hit if not forced
    if (cacheKey && apiCache.has(cacheKey) && !force) {
      setData(apiCache.get(cacheKey));
      setLoading(false);
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

  // Ensure refetch bypasses cache
  const refetch = useCallback(() => fetch({ force: true }), [fetch]);

  return { data, loading, error, refetch };
}

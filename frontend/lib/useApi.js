"use client";

import { useState, useEffect, useCallback } from "react";

// Global in-memory cache for API responses
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Implements SWR (Stale-While-Revalidate) caching mechanism.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key for SWR caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

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

  // Sync state during render for cacheKey changes (dynamic route handling)
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

  const fetch = useCallback(async (options = {}) => {
    const force = options?.force === true;

    if (cacheKey && apiCache.has(cacheKey) && !force) {
      // SWR: Data is already in state, just fetch in background without setting loading to true
      setLoading(false);
    } else {
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

  return {
    data,
    loading,
    error,
    refetch: (opts) => fetch({ force: true, ...opts })
  };
}

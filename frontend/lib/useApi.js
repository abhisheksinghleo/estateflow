"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {String}   cacheKey - Optional cache key to prevent redundant fetching and enable SWR
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  });

  // Derived state for dynamic route changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    if (cacheKey && apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
    } else {
      setData(fallback);
    }
  }

  const [loadingCacheKey, setLoadingCacheKey] = useState(cacheKey);
  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return false;
    }
    return true;
  });

  if (cacheKey !== loadingCacheKey) {
    setLoadingCacheKey(cacheKey);
    setLoading(cacheKey ? !apiCache.has(cacheKey) : true);
  }

  const [error, setError] = useState(null);

  const fetch = useCallback(async (options = {}) => {
    const isForce = options?.force === true;

    if (!isForce && cacheKey && apiCache.has(cacheKey)) {
      // We already have data from derived state, but we should do SWR
      // (Stale-While-Revalidate) in the background without setting loading=true
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
      if (!cacheKey || !apiCache.has(cacheKey) || isForce || loading) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: (opts) => fetch({ force: true, ...opts }) };
}

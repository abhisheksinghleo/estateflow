"use client";

import { useState, useEffect, useCallback } from "react";

// Simple global cache to prevent redundant API calls
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to cache results globally in memory (Stale-While-Revalidate pattern)
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  });
  const [loading, setLoading] = useState(() => {
    // If we have cached data, don't show loading on initial render
    return !(cacheKey && apiCache.has(cacheKey));
  });
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    // Only show loading if we don't have cached data (Stale-While-Revalidate pattern)
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
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

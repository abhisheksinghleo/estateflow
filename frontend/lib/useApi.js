"use client";

import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Implements SWR (Stale-While-Revalidate) in-memory caching to avoid redundant fetches.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional unique key to cache the response.
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Derive state from props during render to handle dynamic route changes
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  const [data, setData] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  });

  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return false; // Data is cached, no initial loading state
    }
    return true;
  });

  const [error, setError] = useState(null);

  // Sync state if cacheKey changes (e.g., navigating to a different property detail page)
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
    // We do not set loading to true here if we already have cached data.
    // This allows the Stale-While-Revalidate pattern: show cached data, fetch in background.
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
  }, [...deps, cacheKey]); // Intentionally omitting fallback to avoid infinite loops when inline arrays are passed

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

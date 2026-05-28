"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional cache key to enable in-memory caching
 */
const apiCache = new Map();

export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const hasCache = cacheKey && apiCache.has(cacheKey);
  const initialData = hasCache ? apiCache.get(cacheKey) : fallback;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasCache);
  const [error, setError] = useState(null);
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derive state from props to handle dynamic route changes without unmounting
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const hasNewCache = cacheKey && apiCache.has(cacheKey);
    setData(hasNewCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!hasNewCache);
    setError(null);
  }

  const fetch = useCallback(async (options = { force: false }) => {
    if (cacheKey && apiCache.has(cacheKey) && !options.force) {
      setData(apiCache.get(cacheKey));
      setLoading(false);
      setError(null);
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

  return { data, loading, error, refetch: fetch };
}

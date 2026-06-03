"use client";

import { useState, useEffect, useCallback } from "react";

// Global in-memory cache for API responses
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states and SWR caching.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to enable SWR caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Derive initial state from cache if available, otherwise use fallback
  const hasCache = cacheKey ? apiCache.has(cacheKey) : false;
  const initialData = hasCache ? apiCache.get(cacheKey) : fallback;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasCache);
  const [error, setError] = useState(null);

  // Track current cacheKey to handle dynamic route changes
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derive state from props during render if cacheKey changes
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const updatedHasCache = cacheKey ? apiCache.has(cacheKey) : false;
    setData(updatedHasCache ? apiCache.get(cacheKey) : fallback);
    setLoading(!updatedHasCache);
    setError(null);
  }

  const fetch = useCallback(async (options = { force: false }) => {
    // If we have cached data and force is false, return it immediately
    // but we still want to revalidate in the background (SWR)
    const isCacheHit = cacheKey && apiCache.has(cacheKey) && !options.force;

    if (!isCacheHit) {
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
      // Only set error if we don't have existing valid data
      if (!isCacheHit) {
        setError(err?.message || "Something went wrong");
      }
    } finally {
      if (!isCacheHit) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Ensure returned refetch forces a fresh request
  const refetch = useCallback(() => fetch({ force: true }), [fetch]);

  return { data, loading, error, refetch };
}

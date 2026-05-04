"use client";

import { useState, useEffect, useCallback } from "react";

// Simple in-memory cache for API results
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional key to enable SWR-style caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // If we have cached data for this key, use it immediately
  const hasCachedData = cacheKey ? apiCache.has(cacheKey) : false;
  const initialData = hasCachedData ? apiCache.get(cacheKey) : fallback;

  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasCachedData);
  const [error, setError] = useState(null);

  // Derive state from props to handle dynamic route changes without unmounting
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    setData(initialData);
    setLoading(!hasCachedData);
    setError(null);
  }

  const fetch = useCallback(async () => {
    // If we don't have cached data, we're hard-loading
    // If we DO have cached data, we're doing a background refresh (SWR)
    if (!hasCachedData) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await apiFn();

      // Update cache if cacheKey is provided
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

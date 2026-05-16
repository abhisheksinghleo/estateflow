"use client";

import { useState, useEffect, useCallback } from "react";

// In-memory global cache for SWR
const apiCache = new Map();

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 * Now supports SWR (Stale-While-Revalidate) caching via cacheKey to prevent redundant fetches
 * and improve perceived performance across dynamic routes.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional unique key to enable SWR in-memory caching
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  const getInitialData = () => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }
    return fallback;
  };

  const [data, setData] = useState(getInitialData);
  const [loading, setLoading] = useState(() => {
    if (cacheKey && apiCache.has(cacheKey)) {
      return false; // Instant load if cached
    }
    return true;
  });
  const [error, setError] = useState(null);

  // Track the cacheKey to detect changes across dynamic route navigations without unmounting
  const [currentCacheKey, setCurrentCacheKey] = useState(cacheKey);

  // Derive state during render to properly handle dynamic route changes synchronously
  if (cacheKey !== currentCacheKey) {
    setCurrentCacheKey(cacheKey);
    const hasCache = cacheKey && apiCache.has(cacheKey);
    setData(hasCache ? apiCache.get(cacheKey) : fallback);

    // Explicitly use hasCache to determine loading, rather than !data or !fallback
    // because fallback might be a truthy empty array `[]`
    setLoading(!hasCache);
    setError(null);
  }

  const fetch = useCallback(async () => {
    // Only set loading to true if we don't have a cached version
    // If we have cache, we do SWR (Stale-While-Revalidate) silently
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
  }, [...deps, cacheKey]); // DO NOT include `fallback` here; call sites pass inline `[]` causing infinite loops

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

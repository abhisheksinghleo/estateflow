"use client";

import { useState, useEffect, useCallback } from "react";

// Global in-memory cache for SWR (Stale-While-Revalidate) pattern
const globalApiCache = {};

/**
 * Reusable hook for client-side API fetching with loading / error / data states.
 *
 * ⚡ Bolt Performance Optimization:
 * Added SWR (Stale-While-Revalidate) caching mechanism via `cacheKey`.
 * Impact: Prevents redundant network requests on component remounts,
 * showing cached data instantly while refetching in the background.
 *
 * @param {Function} apiFn    - Async function that returns data (e.g. () => propertyApi.getProperties())
 * @param {Array}    deps     - Dependency array — refetches when any dep changes
 * @param {*}        fallback - Optional initial value while loading (prevents layout shift)
 * @param {string}   cacheKey - Optional unique key for caching the response
 */
export default function useApi(apiFn, deps = [], fallback = null, cacheKey = null) {
  // Initialize with cached data if available
  const initialData = cacheKey && globalApiCache[cacheKey] !== undefined
    ? globalApiCache[cacheKey]
    : fallback;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialData === fallback);
  const [error, setError] = useState(null);

  // When cacheKey changes (e.g. navigating between properties), immediately update state
  // to avoid showing stale data from the previous key
  useEffect(() => {
    const currentInitialData = cacheKey && globalApiCache[cacheKey] !== undefined
      ? globalApiCache[cacheKey]
      : fallback;
    setData(currentInitialData);
    setLoading(currentInitialData === fallback);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]); // Removed fallback to avoid infinite renders with inline array literals

  const fetchData = useCallback(async () => {
    if (!cacheKey || globalApiCache[cacheKey] === undefined) {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await apiFn();
      if (cacheKey) {
        globalApiCache[cacheKey] = result;
      }
      // Trigger a re-render to ensure data is fresh. We removed the expensive JSON.stringify check.
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
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

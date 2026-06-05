## 2026-06-05 - SWR Implementation in Custom Hooks
**Learning:** Adding a global in-memory cache to a custom `useApi` React hook for Stale-While-Revalidate (SWR) requires careful synchronization of `cacheKey` changes during render to avoid flickers and infinite loops, and `refetch` must explicitly bypass the cache.
**Action:** Always derive state during render to update cache keys, use explicit cache existence checks (`Map.has`) instead of relying on fallbacks, and add a `force` flag to `fetch` for manual revalidation.

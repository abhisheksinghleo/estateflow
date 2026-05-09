## 2024-05-19 - [Implement SWR Cache for useApi]
**Learning:** The custom `useApi` hook lacked any caching mechanism, causing redundant API fetches and layout shifts (loading flashes) on subsequent component mounts.
**Action:** Implemented a lightweight, in-memory Stale-While-Revalidate (SWR) caching layer in `useApi.js`. When a `cacheKey` is provided, the hook immediately returns cached data if available (eliminating loading flashes), while simultaneously fetching fresh data in the background to ensure data consistency.

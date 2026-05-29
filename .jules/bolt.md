
## 2024-05-18 - [In-Memory Caching in React Hooks]
**Learning:** When implementing an in-memory cache in a custom React hook (like `useApi`), relying entirely on `useEffect` to synchronize the cached data causes a brief but noticeable "flash of loading state" if the cache hit occurs after the initial render.
**Action:** Synchronize React state with the cache during the initial render by passing the cache hit value as the `useState` initial value, or derive state from props during render (e.g. `if (cacheKey !== currentCacheKey)`) to properly handle dynamic route changes without unmounting components.

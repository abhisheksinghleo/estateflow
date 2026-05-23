
## 2024-05-23 - [In-memory cache for useApi]
**Learning:** Call sites often pass inline array literals (e.g. `[]`) to hooks which causes infinite render loops if used inside `useEffect` dependency arrays. Using explicit SWR logic directly on render with state hooks avoids unmounting issues.
**Action:** When creating in-memory caches within hooks, ensure React state syncs properly during render and use explicit map lookups rather than relying on initial empty arrays.

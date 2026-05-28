## 2024-05-15 - In-Memory API Caching for useApi hook
**Learning:** Adding a simple in-memory cache using a module-level `Map` in `useApi` efficiently prevents redundant API fetches for previously loaded data, significantly improving navigation performance on the client-side without adding complex state management libraries. The state needs to be properly derived during render to support dynamic route changes without unmounting (e.g. going from /properties/A to /properties/B).
**Action:** Use this caching pattern as a fast and lightweight way to optimize client-side fetching in this project.

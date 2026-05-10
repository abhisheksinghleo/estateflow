## 2024-05-10 - React Derived State Syncing
**Learning:** When modifying `useApi` hook to handle cache invalidation on param changes (like `cacheKey`), failure to manually sync the `loading` state to `true` during the derived state check (`if (cacheKey !== currentCacheKey)`) leads to a UI bug where components briefly render stale "empty/fallback" data without a loading spinner.
**Action:** Always sync all related state variables (data, loading, error) synchronously during render when responding to a prop/parameter change in custom hooks.

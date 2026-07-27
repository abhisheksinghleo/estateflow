## 2024-07-27 - Client-side list filtering and sorting memoization
**Learning:** Complex client-side array filtering and sorting in React components executed on every render can cause significant main thread blocking, reducing application responsiveness.
**Action:** Use `useMemo` hooks to memoize lists based on their dependencies (`activeFilters`, `sort`, data lists). This prevents recalculating the array mapping and sorting on every state change unless the dependencies themselves change.

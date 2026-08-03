## 2024-08-03 - [Missing memoization on client-side sorting and filtering]
**Learning:** React components that filter and sort data arrays during render can cause significant main thread blocking (O(n log n) cost) and unnecessary CPU usage if the data or filter criteria haven't changed.
**Action:** Always wrap client-side filtering and sorting of lists in a `useMemo` hook, ensuring that the dependency array accurately reflects the data and filter state.

## 2024-07-30 - Client-side array filtering & sorting optimizations
**Learning:** Complex client-side array filtering and sorting in React components causes unnecessary executions on every render if not memoized, which can severely degrade performance on large datasets.
**Action:** Always wrap expensive client-side array operations (like filtering and sorting) in `useMemo` hooks with explicit dependency arrays to prevent re-computation on unassociated state changes.

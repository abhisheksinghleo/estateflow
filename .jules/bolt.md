## 2024-05-14 - Unmemoized Client-Side Filtering and Sorting
**Learning:** In Next.js client components, complex array operations like `filter` and `sort` on large datasets will re-run on every render if not memoized. This can cause significant UI thread blocking, especially when components receive frequent updates or state changes.
**Action:** Always wrap complex client-side array processing (filtering, sorting) in `useMemo` hooks with strict dependency arrays to ensure they only re-run when the source data or specific filter/sort parameters change.

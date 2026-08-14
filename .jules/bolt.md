## 2024-05-24 - Memoizing Search Filtering
**Learning:** Complex array filtering combined with O(n log n) sorting operations inside main page components trigger on every re-render (like hover states on list items).
**Action:** Always wrap these combined data processing pipelines (applyFilters + sort) in `useMemo` hooks, keyed by their input data and filter state, to drastically reduce CPU cycle waste.

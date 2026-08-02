## 2024-08-02 - [Memoizing Client-Side Array Operations]
**Learning:** Complex client-side array filtering and sorting in React components (like the Rent and Buy pages) can cause significant main thread blocking and unnecessary object allocations if executed on every render.
**Action:** Always wrap client-side array filtering and sorting logic in `useMemo` hooks, especially when dealing with potentially large datasets or interactive UI components (e.g. search bars, filters) to prevent unnecessary re-execution.

## 2024-07-23 - Memoizing Expensive Client-Side Filtering in Next.js
**Learning:** Complex client-side array filtering and sorting in React components causes unnecessary and expensive re-renders when placed directly in the component body, leading to UI lag when other state changes.
**Action:** Always wrap complex client-side array manipulation (filtering, sorting) in `useMemo` hooks to prevent execution on every render.

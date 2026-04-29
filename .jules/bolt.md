## 2024-05-18 - Prevent Unnecessary Re-renders via useMemo and React.memo
**Learning:** Passing newly created objects directly to components (e.g. `property={{ ...property, city: '...' }}`) inside lists causes React to re-render all children on every parent render because object references change.
**Action:** Always wrap data transformations in `useMemo` and map them before passing to children, and wrap presentation list items like `PropertyCard` in `React.memo` to properly bail out of renders.

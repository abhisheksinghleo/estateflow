## 2024-06-10 - Defeated React.memo in List Mappings
**Learning:** In Next.js list components (like `FeaturedProperties`), array mapping inside the render function creates new object references that completely defeat child component memoization. Even if `React.memo` is used on `PropertyCard`, it won't optimize anything if the parent maps data without `useMemo`.
**Action:** Always wrap array transformations (e.g., mapping raw API data to component props) with `useMemo` before passing them to memoized child components in lists.

# Journal
## 2024-05-02 - PropertyCard Re-render Anti-pattern
**Learning:** The codebase frequently creates new `property` objects inline inside `.map()` loops when rendering `PropertyCard` components (e.g., in `FeaturedProperties`, `BuyPage`, and `RentPage`). This breaks React's default shallow comparison, causing all `PropertyCard` components to re-render unnecessarily whenever the parent component updates (like when changing sort order or applying filters).
**Action:** When wrapping components like `PropertyCard` in `React.memo`, use a custom comparison function (e.g., comparing `property.id`) to bypass the inline object creation anti-pattern, or refactor the parent loops to avoid inline object creation if possible.

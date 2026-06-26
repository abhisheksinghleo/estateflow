## 2023-10-27 - Next.js Image Sizes in Grid Layouts
**Learning:** Omitting the `sizes` property on a `next/image` component (especially when using `fill`) causes Next.js to default to `100vw`. This means it will serve a full-viewport-width image even if the elements are displayed in a small grid layout, somewhat undermining the optimization.
**Action:** Always include a responsive `sizes` attribute (e.g., `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`) when using `fill` on Next.js images within grid layouts.

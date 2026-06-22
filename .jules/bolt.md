## 2024-06-22 - Next.js Image Component and Framer Motion

**Learning:** When migrating from a native `<img>` tag (or `<motion.img>`) to the `next/image` `<Image>` component in Next.js, two critical issues can arise:
1. **Fallback Images (`onError`):** The `next/image` component generates a `srcset` attribute automatically. If an `onError` fallback relies on replacing the `src` attribute, it will fail because browsers prioritize the generated `srcset` over the new `src`.
2. **Framer Motion Animations:** Applying Framer Motion directly to `next/image` can sometimes cause issues.

**Action:**
1. When migrating an `onError` fallback handler to `next/image`, explicitly clear the `srcset` attribute (`e.target.srcset = ""`) within the handler.
2. To preserve Framer Motion animations cleanly, wrap the `<Image>` component in a `<motion.div>` with `position: relative` instead of attempting to animate the image element directly. Ensure the `<Image>` has `fill` and the parent `<motion.div>` has appropriate sizing (e.g., `h-full w-full`).

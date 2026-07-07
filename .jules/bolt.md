## 2024-05-24 - Next.js Image Optimization with Framer Motion

**Learning:** When trying to combine Framer Motion with `next/image` to replace a native `<img>`, using `<motion.img>` directly doesn't work well with Next.js image wrapper properties. Also, when an image fails to load, `next/image` uses a `srcset` which will take precedence over a fallback `src` configured in `onError`.
**Action:** Wrap the Next.js `<Image>` component in a `<motion.div>` to preserve animations. When implementing a fallback handler in `onError` for `next/image`, you must explicitly clear the `e.target.srcset` (i.e. `e.target.srcset = ""`) so the fallback image displays properly.

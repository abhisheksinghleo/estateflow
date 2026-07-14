## 2024-07-14 - Next.js Image Optimization with Framer Motion
**Learning:** Native `<img>` tags combined with Framer Motion (`<motion.img>`) bypass Next.js image optimization, causing full-resolution images to be loaded on initial render, severely impacting Largest Contentful Paint (LCP) and memory.
**Action:** Use Next.js `<Image>` wrapped in a `<motion.div>` for animated images, managing the `onError` fallback through React state rather than direct DOM mutation.

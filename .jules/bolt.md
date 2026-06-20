## 2026-06-20 - Migrating `<img>` to `<Image>` with Framer Motion
**Learning:** When using Framer Motion animations during a migration from native `<img>` to Next.js `<Image>`, applying motion directly to the Next.js image wrapper (e.g., `<motion.img>` or using `motion(Image)`) can break the component structure and styling.
**Action:** Always preserve Framer Motion animations by wrapping the `<Image />` component in a separate `<motion.div>` (with `position: relative` when using `fill`), instead of applying motion directly to the image itself.

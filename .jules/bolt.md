## 2024-06-29 - Missing Next.js Image Config

**Learning:** Next.js `<Image>` component requires proper configuration for external domains in `next.config.js`. Replacing standard `<img>` tags with `<Image>` without verifying the domains list can result in broken images and an incomplete application.

**Action:** Always check and update `next.config.js` with any domains that are used in `src` attributes for `next/image`.

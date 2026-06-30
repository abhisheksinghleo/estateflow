## 2024-05-15 - [LCP Optimization with Next.js Image]
**Learning:** When migrating native `<img>` tags to `next/image`, always check if the image is an "above-the-fold" Hero image. Lazy-loading LCP images penalizes performance. Next.js `<Image>` lazy-loads by default.
**Action:** Always add `priority={true}` to above-the-fold main images when refactoring to `<Image>` to ensure they are preloaded for optimal LCP.

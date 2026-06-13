## 2024-06-13 - [next/image onError srcset bug]
**Learning:** When migrating from standard `<img>` tags to `next/image`, migrating an `onError` fallback handler can fail because browsers prioritize the auto-generated `srcset` from `next/image` over the modified `src`.
**Action:** When handling `onError` in `next/image`, always explicitly clear the `e.target.srcset` (e.g. `e.target.srcset = ""`) alongside updating `e.target.src` to ensure the fallback image renders properly.

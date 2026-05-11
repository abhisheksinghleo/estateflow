## 2024-05-17 - [SWR caching in custom useApi hook]
**Learning:** When implementing an SWR cache in a custom React hook (`useApi`), naive caching (just checking on mount) can lead to infinite loading states or layout shifts when dynamic route changes occur. The React state needs to be fully synchronized.
**Action:** When the `cacheKey` changes, forcefully update the `loading`, `data`, and `error` state during render (e.g. `if (cacheKey !== currentCacheKey)`) to avoid UI bugs where loading spinners fail to appear for new requests.

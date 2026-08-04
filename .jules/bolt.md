## 2024-05-18 - [Initialize Journal]\n**Learning:** This journal will track performance learnings for the real-estate frontend.\n**Action:** Use this to document critical performance patterns.

## 2024-05-18 - [Memoizing client-side filter and sort]
**Learning:** In Next.js client components with complex filter/sort states, arrays like  and  in marketplace listings are prime candidates for `useMemo` since they easily hit O(N log N) during render operations triggered by unrelated state changes.
**Action:** Always wrap heavy list processing in `useMemo` when extracting data from arrays.
## 2024-05-18 - [Memoizing client-side filter and sort]
**Learning:** In Next.js client components with complex filter/sort states, arrays like `filtered` and `sorted` in marketplace listings are prime candidates for `useMemo` since they easily hit O(N log N) during render operations triggered by unrelated state changes.
**Action:** Always wrap heavy list processing in `useMemo` when extracting data from arrays.

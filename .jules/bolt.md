## 2025-06-11 - [Memoize Component Array Mapping]
**Learning:** When rendering a list of React components, mapping over properties and applying structural transformations inline invalidates memoization by returning a new prop object reference on every render.
**Action:** Memoize structural mapping with useMemo so that the exact same prop reference is passed to child components. And then use React.memo on the child component.

## 2024-05-18 - [Fixing Next.js Image Fallback onError Handlers]
**Learning:** [When replacing native \`<img>\` tags with \`next/image\` and migrating an \`onError\` fallback handler, you must explicitly clear \`e.target.srcset\` (e.g., \`e.target.srcset = ""\`) in the handler. Browsers prioritize the automatically generated \`srcset\` over \`src\`, which can cause the fallback image to fail to display.]
**Action:** [Ensure to clear \`e.target.srcset\` when writing custom \`onError\` handlers for Next.js \`<Image>\` components.]

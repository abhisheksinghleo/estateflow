## 2024-05-18 - Avoid Rogue Routes in Next.js App Router
**Learning:** Creating a test `page.jsx` inside the Next.js `app/` directory (e.g., `app/test-card/page.jsx`) instantly creates a publicly accessible production route.
**Action:** Always clean up temporary test pages and log files (e.g., `dev.log`) from the repository before committing.

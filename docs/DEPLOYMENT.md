# Preview and deployment boundaries

This repository builds a local/preview-ready Next.js application for `https://solutions.distilledfunding.com`. It does not create a Vercel project, configure DNS, publish, or connect external systems.

Use Node.js 22 or newer and npm:

```powershell
npm ci
npm run check
npm start
npm run audit:routes
```

The local production server binds to `127.0.0.1:3000`. The route audit checks every canonical page, canonical and robots metadata, internal paths, the empty noindex sitemap, and a genuine 404.

Default `ALLOW_INDEXING=false` is suitable for review. Every page must also receive `status: "index"`, `indexStatus: "index"`, and a current `lastReviewed` date before it can enter a sitemap or receive index metadata. Preview deployment should retain noindex until factual review and the migration/domain plan are approved.

Cross-property hosts are centralized in `data/config/site.json`. Verify actual deep routes before adding further connections. No environment secret or external service is required.

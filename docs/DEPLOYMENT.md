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

Default `ALLOW_INDEXING=false` is suitable for review. Every page must also receive `status: "index"`, `indexStatus: "index"`, and a current `lastReviewed` date before it can enter a sitemap or receive index metadata. The release flag is honored only when `VERCEL_ENV=production`; local, preview, staging, and unknown environments remain noindex even if someone sets it. Keep new or unreviewed editorial content noindex.

Before eventual indexing activation, the owner must attach and verify `solutions.distilledfunding.com` to the existing Vercel project, verify the public production host and HTTPS redirects, complete editorial/source review for each selected page, and intentionally set the production-only `ALLOW_INDEXING` variable. Then inspect the production robots and sitemap output, verify the host in Google Search Console and Bing Webmaster Tools, and submit the sitemap. Search-console account connection and URL submission are owner actions and are not part of this deployment workflow.

Cross-property hosts are centralized in `data/config/site.json`. Verify actual deep routes before adding further connections. No environment secret or external service is required.

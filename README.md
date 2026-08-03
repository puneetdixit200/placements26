# Placements 26

A production-ready Next.js placement intelligence portal for RVITM. It keeps company timelines, packages, JDs, eligibility, selection stages and verified student outcomes in one consistent interface.

## Included

- Responsive placement dashboard
- Search and status filters
- Expandable company briefs with roles, timeline, package, eligibility, skills, JD and application links
- Verified selected-student section with permission-controlled resume links
- Public JSON endpoint at `/api/placements`
- JSON-first ChatGPT-to-GitHub-to-Vercel update pipeline

## Run locally

```bash
npm install
npm run dev
```

## Content updates

All public placement content is stored in `data/placements.json`. Provide the official company message or result in ChatGPT; the structured JSON can be updated in GitHub, and Vercel will deploy the new commit automatically once Git integration is enabled.

See `docs/UPDATE_PIPELINE.md` for the operating rules.

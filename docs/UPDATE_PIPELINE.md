# Chat-to-Website Update Pipeline

## Goal

Turn an unstructured placement message into a verified website update without editing React components for every company.

## Production flow

```text
Placement-cell message / JD / result
              ↓
ChatGPT extracts structured fields
              ↓
Validation: dates, links, package, eligibility, status
              ↓
Update data/placements.json in GitHub
              ↓
Vercel Git deployment from main
              ↓
Website + /api/placements updated
```

## Information to provide for a company update

Paste the source message and, when available, include:

- Company name
- Roles
- Industry/domain
- CTC and/or stipend
- Location and work mode
- Eligible branches, CGPA and backlog rules
- Registration deadline with timezone
- Application link
- Official JD link or file
- Selection stages and dates
- Current status: draft, upcoming, active, closed or completed
- Any special instructions

Incomplete information is allowed. Unknown fields remain `null` or `To be confirmed`; they must never be guessed.

## Selected-student update

For each published profile provide:

- Student name
- Company and role
- Branch and batch
- Resume link
- LinkedIn link, optional
- Short achievement or preparation note, optional
- Confirmation that the selection is official
- Confirmation that the student permitted resume publication

Set `verified` to `true` only after both confirmations.

## Safety and accuracy rules

1. The official placement-cell communication is the source of truth.
2. Never infer a package, deadline, eligibility rule or result.
3. Use ISO dates in JSON, for example `2026-08-14T17:00:00+05:30`.
4. Keep raw source links in `applicationUrl` and `jdUrl`.
5. Update `meta.lastUpdated` on every content change.
6. Treat resume URLs as personal data and publish them only with permission.
7. Prefer a GitHub pull request for large batches; direct commits are suitable for urgent verified corrections.

## Future database upgrade

The JSON feed is deliberately simple for launch. When update volume or editor count grows, the same front end can move to Supabase with:

- `companies`
- `roles`
- `timeline_events`
- `announcements`
- `selected_students`
- `documents`
- authenticated placement-team editors

The public API route already provides a clean boundary for that migration.

# Interview Tracker

A minimal interview workspace with invitation-only accounts, Gmail-imported records, and grouped interview rounds.

## Features

- Applications grouped by company and job role, with all rounds shown together.
- Latest interview dates first; undated records appear last.
- One US Eastern date with USA Eastern and India IST time rows.
- Upcoming, Completed, Needs review, and Cancelled status filters.
- Meeting links, notes, email evidence, and activity history for each round.
- Owner-approved invitations, viewer/editor roles, and immediate access revocation.
- Password creation through a one-use invitation, secure sessions, and login throttling.
- Authenticated mailbox import API that preserves manual changes and deleted records.

## Stack

React 19, TypeScript, Vinext/Vite, Cloudflare Workers, D1 (SQLite), and Drizzle.

## Development

Requires Node.js 22.13+ and pnpm (the declared version is in package.json).

```bash
pnpm install
pnpm dev
pnpm build
```

This source was created for Sites hosting. `.openai/hosting.json` identifies the existing Site and declares its D1 binding. Runtime secrets and live database contents are provisioned separately; they are not included here. If running independently, configure the Worker environment and the `DB` binding for your own deployment.

Apply the SQL migrations in `drizzle/` to an empty database in order. Do not replay migrations on an existing database. Never commit local database files or environment secrets.

## Authentication configuration

Set these server-side secrets using your hosting environment:

- `AUTH_PEPPER`: a cryptographically random secret used for password hashing.
- `SYNC_SERVICE_TOKEN`: a separate secret for the trusted mailbox sync service.

Keep their values out of the browser, source control, and logs. The owner email is configured in `lib/account.ts`; the connected mailbox configuration is in `lib/mailbox.ts`. The live owner sets their own password with a one-use setup invitation; no owner password is stored in this repository.

An authorized service can call `POST /api/auth` with action `bootstrap` and its `x-interview-sync-key` header to generate initial owner setup when no owner exists. Once established, only the owner can invite or revoke users.

## Mailbox syncing

The Gmail integration uses an external read-only sync workflow that imports records through `/api/mailbox-sync`. Cloning this repository alone does not connect a Gmail account or create a recurring sync. The external workflow needs its own authorized Gmail connection and server-side service authentication. Existing Sites syncing remains configured separately.

The app does not send emails or modify calendar events. A past invitation remains Needs review until there is evidence the interview happened.

## Repository contents

Includes application source, dependency lockfile, configuration, static assets, and schema migrations. Excludes passwords, environment secret values, database contents, interview records, mailbox messages, dependency folders, and build output.

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

React 19, TypeScript, Next.js, Netlify Functions, Neon PostgreSQL, and Drizzle.

## Run Your Own Deployment

Requires Node.js 22.13+, pnpm, a Netlify account, and a Neon project. The app runs as a Next.js app on Netlify and connects to Neon over its serverless PostgreSQL driver.

1. Create a Neon project and copy its pooled connection string into `DATABASE_URL`.
2. Copy `.env.example` to `.env.local` for local development and fill in the values below.
3. Run `pnpm install`, `pnpm db:migrate`, `pnpm dev`, and `pnpm build`.
4. Import the repository into Netlify. The included `netlify.toml` configures the Next.js adapter and build command.
5. Add the same environment variables in Netlify site settings, then deploy. Set `APP_URL` to the final public HTTPS URL and `GOOGLE_REDIRECT_URI` to `APP_URL/api/google/callback`.

Never commit `.env.local`, database contents, or secret values. After deploy, call `POST /api/auth` with action `bootstrap` and the `x-interview-sync-key` header to create the one-use owner invitation. The app creates the link but does not send email.

## Authentication configuration

Set these server-side environment variables locally and in Netlify:

- `DATABASE_URL`: Neon pooled PostgreSQL connection string.
- `APP_URL`: the public URL used to create invitation links.
- `OWNER_EMAIL`: your owner account email address.
- `AUTH_PEPPER`: a cryptographically random secret used for password hashing.
- `SYNC_SERVICE_TOKEN`: a separate secret for the trusted mailbox sync service.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: OAuth client credentials from Google Cloud Console.
- `GOOGLE_REDIRECT_URI`: OAuth callback URL registered in Google Cloud Console; defaults to `${APP_URL}/api/google/callback`.
- `GOOGLE_TOKEN_ENCRYPTION_KEY`: base64-encoded 32-byte key used to encrypt the stored refresh token. Generate one with `openssl rand -base64 32`.
- `MAILBOX_ACCOUNT`: optional display fallback for existing importer data.

Keep secrets out of the browser, source control, and logs. The owner sets a password using the one-use setup invitation; no owner password is stored in this repository.

An authorized service can call `POST /api/auth` with action `bootstrap` and its `x-interview-sync-key` header to generate initial owner setup when no owner exists. Once established, only the owner can invite or revoke users.

## Gmail Connection and Import

The owner connects Gmail from the Mailbox view. Enable the Gmail API in Google Cloud, configure a Google OAuth Web application with the Gmail read-only scope, and add the callback URL above as an authorized redirect URI. The app encrypts and stores the refresh token in Neon. A separate scheduled importer can fetch `GET /api/google/token` using `x-interview-sync-key`, exchange that refresh token for an access token, parse messages, and submit structured records to `POST /api/mailbox-sync` with the same service token. No Google client secret or refresh token is exposed to the browser. The app does not yet implement the scheduled Gmail message parser.

The app does not send emails or modify calendar events. A past invitation remains Needs review until there is evidence the interview happened.

## Repository contents

Includes application source, dependency lockfile, configuration, static assets, and schema migrations. Excludes passwords, environment secret values, database contents, interview records, mailbox messages, dependency folders, and build output.

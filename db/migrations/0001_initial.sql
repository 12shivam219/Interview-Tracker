CREATE TABLE IF NOT EXISTS interviews (
  id text PRIMARY KEY,
  owner text NOT NULL,
  data text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_interviews_owner ON interviews (owner);

CREATE TABLE IF NOT EXISTS mailbox_records (
  id text PRIMARY KEY,
  source_key text NOT NULL,
  data text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mailbox_source_key ON mailbox_records (source_key);

CREATE TABLE IF NOT EXISTS mailbox_sync (
  id text PRIMARY KEY,
  data text NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  id text PRIMARY KEY,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  password_hash text NOT NULL,
  salt text NOT NULL,
  enabled text NOT NULL DEFAULT '1',
  created text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_email ON accounts (email);

CREATE TABLE IF NOT EXISTS invitations (
  hash text PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL,
  expires text NOT NULL,
  used text NOT NULL DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS login_limits (
  key text PRIMARY KEY,
  rate_window text NOT NULL,
  attempts text NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  hash text PRIMARY KEY,
  account_id text NOT NULL,
  expires text NOT NULL
);

CREATE TABLE IF NOT EXISTS google_connections (
  id text PRIMARY KEY,
  email text NOT NULL,
  refresh_token_ciphertext text NOT NULL,
  refresh_token_iv text NOT NULL,
  connected_at text NOT NULL
);
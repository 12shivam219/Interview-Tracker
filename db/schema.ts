import { pgTable, text, index, uniqueIndex } from "drizzle-orm/pg-core";
export const interviews = pgTable("interviews", { id:text("id").primaryKey(), owner:text("owner").notNull(), data:text("data").notNull() }, t=>[index("idx_interviews_owner").on(t.owner)]);

export const mailboxRecords = pgTable("mailbox_records", { id:text("id").primaryKey(), sourceKey:text("source_key").notNull(), data:text("data").notNull() },t=>[index("idx_mailbox_source_key").on(t.sourceKey)]);
export const mailboxSync = pgTable("mailbox_sync", { id:text("id").primaryKey(), data:text("data").notNull() });

export const accounts = pgTable("accounts", {id:text("id").primaryKey(),email:text("email").notNull(),name:text("name").notNull(),role:text("role").notNull(),passwordHash:text("password_hash").notNull(),salt:text("salt").notNull(),enabled:text("enabled").notNull().default("1"),created:text("created").notNull()},t=>[uniqueIndex("idx_accounts_email").on(t.email)]);
export const sessions = pgTable("sessions",{hash:text("hash").primaryKey(),accountId:text("account_id").notNull(),expires:text("expires").notNull()});
export const invitations = pgTable("invitations",{hash:text("hash").primaryKey(),email:text("email").notNull(),role:text("role").notNull(),expires:text("expires").notNull(),used:text("used").notNull().default("0")});
export const loginLimits = pgTable("login_limits",{key:text("key").primaryKey(),rateWindow:text("rate_window").notNull(),attempts:text("attempts").notNull()});
export const googleConnections = pgTable("google_connections",{id:text("id").primaryKey(),email:text("email").notNull(),refreshTokenCiphertext:text("refresh_token_ciphertext").notNull(),refreshTokenIv:text("refresh_token_iv").notNull(),connectedAt:text("connected_at").notNull()});

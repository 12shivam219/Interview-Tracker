import { sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
export const interviews = sqliteTable("interviews", { id:text("id").primaryKey(), owner:text("owner").notNull(), data:text("data").notNull() }, t=>[index("idx_interviews_owner").on(t.owner)]);

export const mailboxRecords = sqliteTable("mailbox_records", { id:text("id").primaryKey(), sourceKey:text("source_key").notNull(), data:text("data").notNull() },t=>[index("idx_mailbox_source_key").on(t.sourceKey)]);
export const mailboxSync = sqliteTable("mailbox_sync", { id:text("id").primaryKey(), data:text("data").notNull() });

export const accounts = sqliteTable("accounts", {id:text("id").primaryKey(),email:text("email").notNull(),name:text("name").notNull(),role:text("role").notNull(),passwordHash:text("password_hash").notNull(),salt:text("salt").notNull(),enabled:text("enabled").notNull().default("1"),created:text("created").notNull()},t=>[uniqueIndex("idx_accounts_email").on(t.email)]);
export const sessions = sqliteTable("sessions",{hash:text("hash").primaryKey(),accountId:text("account_id").notNull(),expires:text("expires").notNull()});
export const invitations = sqliteTable("invitations",{hash:text("hash").primaryKey(),email:text("email").notNull(),role:text("role").notNull(),expires:text("expires").notNull(),used:text("used").notNull().default("0")});
export const loginLimits = sqliteTable("login_limits",{key:text("key").primaryKey(),window:text("window").notNull(),attempts:text("attempts").notNull()});

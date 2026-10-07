CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`enabled` text DEFAULT '1' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_accounts_email` ON `accounts` (`email`);--> statement-breakpoint
CREATE TABLE `invitations` (
	`hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`expires` text NOT NULL,
	`used` text DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `login_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window` text NOT NULL,
	`attempts` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`expires` text NOT NULL
);

CREATE TABLE `mailbox_records` (
	`id` text PRIMARY KEY NOT NULL,
	`source_key` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_mailbox_source_key` ON `mailbox_records` (`source_key`);--> statement-breakpoint
CREATE TABLE `mailbox_sync` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);

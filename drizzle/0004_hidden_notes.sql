ALTER TABLE `notes` ADD `is_hidden` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notes` ADD `hidden_password_hash` text;

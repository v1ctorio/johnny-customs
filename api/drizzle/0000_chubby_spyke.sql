CREATE TABLE `submissions_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user` text NOT NULL,
	`item` text NOT NULL,
	`submission_date` integer NOT NULL,
	`declared_value` integer NOT NULL,
	`declared_value_usd` integer NOT NULL,
	`paid_customs` integer NOT NULL,
	`paid_customs_usd` integer NOT NULL,
	`country_code` text NOT NULL,
	`additional_information` text
);

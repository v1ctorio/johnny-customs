import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions_table = sqliteTable("submissions_table", {
  id: int().primaryKey({ autoIncrement: true }),
	user: text().notNull(), // Slack user ID
  item: text().notNull(), // Item name
  submission_date: int().notNull(), // Unix timestamp
	country_code: text().notNull(), // ISO 3166-1 alpha-2 country code
	country: text().notNull(), // Country name
	currency: text().notNull(), // Currency code
  declared_value: int().notNull(), // Declared value in cents, local currency
	declared_value_usd: int().notNull(), // Declared value in cents, USD
	paid_customs: int().notNull(), // Paid customs in cents, local currency
	paid_customs_usd: int().notNull(), // Paid customs in cents, USD
	additional_information: text(), // Additional information
	approved: int().notNull().default(0), // 0 = pending, 1 = approved, 2 = rejected
});
export enum submission_status {
	PENDING = 0,
	APPROVED = 1,
	REJECTED = 2
}
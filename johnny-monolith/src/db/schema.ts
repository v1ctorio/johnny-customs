import { date, pgTable, integer, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const submissionsTable = pgTable("submissions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	payment_date: date().notNull(),
	submission_time: timestamp().defaultNow().notNull(),


	submitter: varchar({length:32}).notNull(),
	approved: boolean().default(false),
	country: varchar({length:2}).notNull(), // ISO 3166-1 alpha-2 country code
	declared_value: integer().notNull(), // in cents
	paid_customs: integer().notNull(), // in cents
	notes: varchar({length: 500}),

	thing_id: varchar({length: 16}).notNull().references(() => thingsTable.id, { onDelete: 'no action' }), 
})


export const thingsTable = pgTable("things", {
	id: varchar({length: 16}).primaryKey(), // short unique identifier without special characters
	name: varchar({length: 64}).notNull(), // full name of the thing
})
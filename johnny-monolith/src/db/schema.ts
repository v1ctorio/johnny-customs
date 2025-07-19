import { date, pgTable, integer, varchar, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const submissionsTable = pgTable("submissions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	payment_date: date().notNull(),
	submission_time: timestamp().defaultNow().notNull(),


	submitter: varchar({length:32}).notNull(),
	approved: boolean().default(false).notNull(),
	country: varchar({length:2}).notNull(), // ISO 3166-1 alpha-2 country code
	declared_value: integer().notNull(), // in cents
	paid_customs: integer().notNull(), // in cents
	notes: varchar({length: 500}),

	thing_id: varchar({length: 32}).notNull().references(() => thingsTable.id, { onDelete: 'no action' }), 
})


export const thingsTable = pgTable("things", {
	id: varchar({length: 32}).primaryKey(), // short unique identifier without special characters
	name: varchar({length: 64}).notNull(), // full name of the thing
	image: varchar({length: 256})
})


export const countriesData = pgTable("countries_data", {
	iso3316_1a2: varchar({length:2}).primaryKey(), //2 chars country code 
	iso4217: varchar({length:3}).notNull(),// currency code
	full_name: varchar().notNull(),
	flag: varchar(),
	inverseRate: doublePrecision().notNull()
})
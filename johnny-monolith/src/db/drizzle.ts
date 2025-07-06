import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL || "postgres://postgres:himom@localhost:5432/postgres")
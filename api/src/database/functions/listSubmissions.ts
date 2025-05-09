import { and, eq } from "drizzle-orm";
import database from "../index.js";
import { submission_status, submissions_table } from "../schema.js";

export default async function listSubmissions({
  skip,
  take,
  country,
  allowAll,
}: {
  skip: number;
  take: number;
  country?: string;
  allowAll?: boolean;
}): Promise<(typeof submissions_table.$inferSelect)[]> {
	if (country) {
    return database
      .select()
      .from(submissions_table)
      .limit(take)
      .offset(skip)
      .where(and(eq(submissions_table.country_code, country), eq(submissions_table.approved, submission_status.APPROVED)));
  }
  if (allowAll) {
    return database
      .select()
      .from(submissions_table)
      .limit(take)
      .offset(skip);
    }
	return database.select().from(submissions_table).offset(skip).where(eq(submissions_table.approved,submission_status.APPROVED));
}
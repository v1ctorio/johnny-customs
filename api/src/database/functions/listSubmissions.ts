import { eq } from "drizzle-orm";
import database from "../index.js";
import { submissions_table } from "../schema.js";

export default async function listSubmissions({
  skip,
  take,
  country,
}: {
  skip: number;
  take: number;
  country?: string;
}): Promise<(typeof submissions_table.$inferSelect)[]> {
	if (country) {
    return database
      .select()
      .from(submissions_table)
      .limit(take)
      .offset(skip)
      .where(eq(submissions_table.country_code, country));
  }
	return database.select().from(submissions_table).limit(take).offset(skip);
}

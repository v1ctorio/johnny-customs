import { LibSQLDatabase } from "drizzle-orm/libsql";
import { submissions_table } from "../schema";

export default  async function listSubmissions(database: LibSQLDatabase,{ skip, take }: {
		skip: number;
		take: number;
}): Promise<typeof submissions_table.$inferSelect[]> {

	return database.select().from(submissions_table);
}
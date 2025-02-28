import database from "../index.js";
import { submissions_table } from "../schema.js";

export default async function listSubmissions({ skip, take }: {
		skip: number;
		take: number;
}): Promise<typeof submissions_table.$inferSelect[]> {
	return database.select().from(submissions_table).limit(take).offset(skip);
}
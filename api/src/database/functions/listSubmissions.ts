import { eq } from "drizzle-orm";
import database from "../index.js";
import { submission_status, submissions_table } from "../schema.js";

export default async function listSubmissions({ skip, take }: {
		skip: number;
		take: number;
	}, 
		status:submission_status = submission_status.APPROVED
): Promise<typeof submissions_table.$inferSelect[]> {
	return database.select().from(submissions_table).where(eq(submissions_table.approved,status)).limit(take).offset(skip);
}
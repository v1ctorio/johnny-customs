import { eq } from "drizzle-orm";
import database from "../index.js";
import { submission_status, submissions_table } from "../schema.js";


export default async function editSubmissionStatus(submission_id: number, status: submission_status) {
	
	await database.update(submissions_table).set({approved: status}).where(eq(submissions_table.id,submission_id)).execute();


	return status;
}
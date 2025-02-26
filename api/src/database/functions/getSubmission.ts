import { submissions_table } from '../schema';
import database from "..";
import { eq } from 'drizzle-orm';

export default async function getSubmission(ID:number) {

	return await database.select().from(submissions_table).where(eq(submissions_table.id,ID));
	
}
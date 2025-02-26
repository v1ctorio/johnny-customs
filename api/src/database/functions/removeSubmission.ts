import { submissions_table } from '../schema';
import database from "..";
import { eq } from 'drizzle-orm';

export default async function removeSubmission(ID:number) {

	return await database.delete(submissions_table).where(eq(submissions_table.id,ID));
	
}
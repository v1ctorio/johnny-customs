import database from "../index.js";
import { submissions_table } from "../schema.js";

export default async function getItems() {
	const rows = await database.selectDistinct({item: submissions_table.item})
		.from(submissions_table)
		.orderBy(submissions_table.item);

	const items = rows.map(row => row.item);
	return [... new Set(items)];
}
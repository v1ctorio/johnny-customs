import { drizzle } from 'drizzle-orm/libsql';

const DB_FILE_NAME = 'file:local.db';

export default drizzle(DB_FILE_NAME);

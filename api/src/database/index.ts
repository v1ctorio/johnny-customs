import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema'

const DB_FILE_NAME = 'file:local.db';

export default drizzle(DB_FILE_NAME, { schema });

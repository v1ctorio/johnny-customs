'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db/drizzle';
import { thingsTable } from '@/db/schema';


export async function getThings() {
	const things = await db.select().from(thingsTable);
	return things;
}

export async function getThingById(id: string) {
	const thing = await db.select().from(thingsTable).where(eq(thingsTable.id, id)).limit(1).then(rows => rows[0]);
	return thing;
}
export async function createThing(name: string) {

	const id = name.trim().replace(/[\W]/g,'').substring(0,16).toLowerCase();
	if (name.trim().length > 64) {
		throw new Error('Thing full name must be 64 characters or less');
	}
	const newThing = await db.insert(thingsTable).values({ id, name: name.trim() }).returning();
	revalidatePath('/api/things');
	return newThing[0];
}


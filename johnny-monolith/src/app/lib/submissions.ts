'use server';

import { z } from "zod"
import { db } from "@/db/drizzle"
import { submissionsTable } from "@/db/schema"
import { eq } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod';


const submissionInsertSchema = createInsertSchema(submissionsTable)


export async function createSubmission({formData, submitter}:{formData: FormData, submitter: string}
) {
  const thing_id = formData.get('thing_id')
  const notes = formData.get('notes')
  const payment_date = formData.get('payment_date')
  const country = formData.get('country')
  const declared_value = formData.get('declared_value')
  const paid_customs = formData.get('paid_customs')

  submissionInsertSchema.parse({
    thing_id,
    notes,
    payment_date: new Date(payment_date as string),
    country,
    declared_value: parseInt(declared_value as string, 10),
    paid_customs: parseInt(paid_customs as string, 10),
    submitter,
  })

  const entry = await db.insert(submissionsTable).values({
    thing_id: thing_id as string,
    notes: notes as string,
    payment_date: payment_date ? new Date(payment_date as string) : new Date(),
    country: country as string,
    declared_value: parseInt(declared_value as string, 10),
    paid_customs: parseInt(paid_customs as string, 10),
    submitter: submitter,
  })
}
 
export async function deleteSubmission(formData: FormData) {
  const id = formData.get('id')
  return id
}

export async function updateSubmission(formData: FormData) {
  const id = formData.get('id')
  const title = formData.get('title')
  const content = formData.get('content')

  return null as any as [] 
}

export async function approveSubmission(submission_ID: number,reject = false){
  await db
  .update(submissionsTable)
  .set({
    approved: !reject
  })
  .where(eq(submissionsTable.id, submission_ID))

}

export async function listSubmissions(length?: number, offset: number = 0) {
  'use server'
  return null as any as Log[] | undefined
}


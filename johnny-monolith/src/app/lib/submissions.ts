'use server';

import { z } from "zod"
import { db } from "@/db/drizzle"
import { submissionsTable, thingsTable } from "@/db/schema"
import { eq } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod';
import { countries, validCountryCodes } from "./constants";
import { sendToSlack } from "./slack";
import { createThing, getThingById } from "./things";
import { CountryCode, countryToCurrency, exchangeCurrency } from "./money";


export interface APISubmission {
  id: string;
  thing: string; // name of the thing customs were paid for
  thing_id: string;

  submitter: string; // Log author slack id
  country: string //2 letter country code
  country_full_name: string
  currency: string; // currency symbol
  declared_value?: number; // value declared to customs
  paid_customs: number

  notes?: string; 
  approved: boolean; 

  declared_value_usd?: number;
  piad_customs_usd?: number
}

const submissionInsertSchema = createInsertSchema(submissionsTable)


export async function createSubmission({formData, submitter, newThingName}:{formData: FormData, submitter: string,newThingName?:string}
) {
  const thing_id = formData.get('thing_id')
  const notes = formData.get('notes')
  const payment_date = formData.get('payment_date')
  const country = formData.get('country')
  const declared_value = formData.get('declared_value')
  const paid_customs = formData.get('paid_customs')




  let dat = submissionInsertSchema.parse({
    thing_id,
    notes,
    payment_date: payment_date ? new Date(payment_date as string) : new Date(),
    country,
    declared_value: parseInt(declared_value as string, 10),
    paid_customs: parseInt(paid_customs as string, 10),
    submitter,

  })

  let thing = await getThingById(dat.thing_id)

  if (!thing) {
    if(!newThingName) {
        throw new Error("No thing name provider neither valid thing_id")
      }
    //TODO: Fix that thing id could be duplicated and that would do something or idk
    thing = await createThing(newThingName)
    dat = submissionInsertSchema.parse({...dat,thing_id:thing.id})
  }

  if (!validCountryCodes.includes(dat.country)) {
    throw new Error("Invalid country code provided")
  }

  const newRow = (await db.insert(submissionsTable).values(dat).returning())[0]

  await dispatchNewRow(newRow, !!newThingName)
  return newRow

}
 
export async function deleteSubmission(submission_id: number) {
  await db.delete(submissionsTable).where(eq(submissionsTable.id,submission_id))
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

export async function listSubmissions(length: number = 30, offset: number = 0, includeUnapproved = false): APISubmission[] {
  'use server'
  let submissions
  const base_query = db.select().from(submissionsTable).innerJoin(thingsTable,eq(submissionsTable.thing_id, thingsTable.id)).orderBy(submissionsTable.id).limit(length).offset(offset)
  if (!includeUnapproved) {
    submissions = await base_query.where(eq(submissionsTable.approved, true))
  } else {
    submissions = await base_query
  }

  const returnSubmission: APISubmission[] = submissions.map( async s => {

    const cur =  countryToCurrency[s.submissions.country as CountryCode]
    return {
        id: s.submissions.id,
  thing: s.things.name, 
  thing_id: s.things.id,

  submitter: s.submissions.submitter,
  country: s.submissions.country,
  country_full_name: countries[s.submissions.country as CountryCode],
  currency: cur,
  declared_value: s.submissions.declared_value, 
  paid_customs: s.submissions.paid_customs,
  notes: s.submissions.notes, 
  approved: s.submissions.approved, 

  declared_value_usd: await exchangeCurrency(cur,"USD",s.submissions.declared_value),
  paid_customs_usd: await exchangeCurrency(cur,"USD", s.submissions.paid_customs)
}
  })

  return returnSubmission
}

async function dispatchNewRow(submission: typeof submissionsTable.$inferSelect,includesNewThing = false) {
  sendToSlack(`New submission recived \n\n \`\`\`${JSON.stringify(submission)}\`\`\`` + (includesNewThing ? "\n __Adds a new thing__" : ""))
}

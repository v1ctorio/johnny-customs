'use server';

import { db } from "@/db/drizzle"
import { submissionsTable, thingsTable } from "@/db/schema"
import { count, eq } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod';
import { countries, countryToCurrency, getCountriesData } from "./constants";
import { sendToSlack } from "./slack";
import { createThing, getThingById } from "./things";
import { CountryCode, currencyToUSD } from "./money";


export interface APISubmission {
  id: number;
  thing: string; // name of the thing customs were paid for
  thing_id: string;

  submitter: string; // Log author slack id
  country: string //2 letter country code
  country_full_name: string
  currency: string; // currency symbol
  declared_value: number; // value declared to customs
  paid_customs: number

  notes?: string; 
  approved: boolean; 

  declared_value_usd: number;
  paid_customs_usd: number
}

const submissionInsertSchema = createInsertSchema(submissionsTable)

export type submissionInsert = typeof submissionsTable.$inferInsert

export async function createSubmission(insertData:submissionInsert, newThingName? :string){
 
  let ID = submissionInsertSchema.parse(insertData)

  let thing = await getThingById(ID.thing_id)

  if (!thing) {
    if(!newThingName) {
        throw new Error("No thing name provider neither valid thing_id")
      }
    //TODO: Fix that thing id could be duplicated and that would do something or idk
    thing = await createThing(newThingName)
    ID = submissionInsertSchema.parse({...insertData,thing_id:thing.id})
  }

  const newRow = (await db.insert(submissionsTable).values(ID).returning())[0]

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

export async function listSubmissions(length: number = 30, offset: number = 0, includeUnapproved = false): Promise<APISubmission[]> {
  'use server'
  let submissions
  const base_query = db.select().from(submissionsTable).innerJoin(thingsTable,eq(submissionsTable.thing_id, thingsTable.id)).orderBy(submissionsTable.id).limit(length).offset(offset)
  if (!includeUnapproved) {
    submissions = await base_query.where(eq(submissionsTable.approved, true))
  } else {
    submissions = await base_query
  }

  const countries_data = await getCountriesData()

  const returnSubmission: APISubmission[] = submissions.map( s => {

    const cur =  countryToCurrency[s.submissions.country as keyof typeof countryToCurrency] ?? "UNK"
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
  notes: s.submissions.notes ?? undefined, 
  approved: s.submissions.approved || false, 

  declared_value_usd: currencyToUSD(cur,s.submissions.declared_value,countries_data),
  paid_customs_usd: currencyToUSD(cur,s.submissions.paid_customs,countries_data)
}
  })

  return returnSubmission
}

async function dispatchNewRow(submission: typeof submissionsTable.$inferSelect,includesNewThing = false) {
  sendToSlack(`New submission recived \n\n \`\`\`${JSON.stringify(submission)}\`\`\`` + (includesNewThing ? "\n __Adds a new thing__" : ""))
}

export async function getSubmissionCount(){
  return (await db.select({count: count()}).from(submissionsTable))[0].count
}

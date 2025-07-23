import { createSubmission } from "@/app/lib/submissions";
import { createThing } from "@/app/lib/things";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { countriesData, submissionsTable, thingsTable } from "@/db/schema";
import { and, count, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
interface newSubBody{
	thing_id:string;
	thing_name:string;
	country:string;
	declared_value:number;
	paid_customs: number;
	payment_date: string;
	notes:string;

	create_new_thing: boolean
}
export const POST = auth(async(req) =>{
	const date = new Date(Date.now()-5*60*1000)

	if(!req.auth) {
		return Response.json({message:"Unauthenticated"},{status:401})
	}
	const submitterId = req.auth.user?.id
	if (!submitterId) {
		return Response.json({message:"Unauthenticated"},{status:401})
	}
	const rateLimitingSubmission = (await db.select({value:count()}).from(submissionsTable).where(and(eq(submissionsTable.submitter,submitterId),gt(submissionsTable.submission_time,date))))[0].value
	if (rateLimitingSubmission > 0) {
		return NextResponse.json({message:"Rate limit exceeded"},{status:429})
	}


	const DATA: newSubBody = await req.json()
	const c = (await db.select({cur:countriesData.iso4217}).from(countriesData).where(eq(countriesData.iso3316_1a2,DATA.country)))

	console.log(DATA,c)
	if (!c){
		return fmtErr("Invalid country")
	}
	if (isNaN(Date.parse(DATA.payment_date))){
		console.log(Date.parse(DATA.payment_date))
		return fmtErr("Invalid date")
	}


	if (!isNonNegativeNumber(DATA.declared_value)){
		return fmtErr("Invalid declared_value amount")
	}
	
	if (!isNonNegativeNumber(DATA.paid_customs)){
		return fmtErr("Invalid paid_customs amount")
	}

	if (DATA.create_new_thing && DATA.thing_name === "") {
		return Response.json({message:"thing_name is needed when creating a new thing"},{status:409})
	}
	
	let thing_id = DATA.create_new_thing ? generateThingId(DATA.thing_name): DATA.thing_id

	if (thing_id === ""){
		thing_id = generateThingId(DATA.thing_name)
		if (thing_id === ""){
			return Response.json({"message":"Error generating the thing_id from the name"},{status:500})
		}
	}

	const existingThingCount = (await db.select({value:count()}).from(thingsTable).where(eq(thingsTable.id, thing_id)))[0]
	if(DATA.create_new_thing){

		thing_id = generateThingId(DATA.thing_name)
		

		if (existingThingCount.value > 0){
			return Response.json({message:`Thing with the id ${thing_id} already exists.`},{status:409})
		}
		await createThing(DATA.thing_name, thing_id)

	} else if (existingThingCount.value !== 1){
			return Response.json({message:"Provided thing_id doesn't exist."},{status:409})
		}

		const submissionInputData = {
			country: DATA.country,
			declared_value: DATA.declared_value*100,
			paid_customs: DATA.paid_customs*100,
			payment_date: DATA.payment_date,
			submitter: submitterId,
			thing_id,
			approved: false,
			notes: DATA.notes,
			submission_time: undefined
		}
		
		// if (DATA.create_new_thing){
		// 	await createSubmission(submissionInputData, DATA.thing_name)
		// }

		const newSubmission = await createSubmission(submissionInputData)
	
		return Response.json({submission:newSubmission,message:"Successfully created a new submission"},{status:200})


})

function fmtErr(msg:string) {
	return NextResponse.json({message:"Formatting error in the add request "+msg},{status:422})
}

const isNonNegativeNumber = (n: number) => n >= 0 && !isNaN(n)

 const generateThingId = (s:string) => s.trim().replace(/[\W]/g,'').substring(0,32).toLowerCase();

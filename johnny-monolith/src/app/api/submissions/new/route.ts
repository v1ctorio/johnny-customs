import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { countriesData, submissionsTable } from "@/db/schema";
import { and, count, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { number } from "zod/v4";
interface newSubBody{
	things:string;
	country:string;
	declared_value:number;
	paid_customs: number;
	payment_day: string;
	notes:string;

	
}
export const POST = auth(async(req) =>{
	const date = new Date(Date.now()-5*60*1000)

	if(!req.auth) {
		return Response.json({message:"Unauthenticated"},{status:401})
	}
	console.log(req.auth)
	const submitterId = req.auth.user?.id
	if (!submitterId) {
		return Response.json({message:"Unauthenticateddddd"},{status:401})
	}
	const rateLimitingSubmission = (await db.select({value:count()}).from(submissionsTable).where(and(eq(submissionsTable.submitter,submitterId),gt(submissionsTable.submission_time,date))))[0].value
	if (rateLimitingSubmission > 0) {
		return NextResponse.json({message:"Rate limit exceeded"},{status:429})
	}


	const DATA: newSubBody = await req.json()
	const c = (await db.select({cur:countriesData.iso4217}).from(countriesData).where(eq(countriesData.iso3316_1a2,DATA.country)))[0]

	if (!c){
		return fmtErr("Invalid country")
	}
	if (isNaN(Date.parse(DATA.payment_day))){
		return fmtErr("Invalid date")
	}


	if (!isValidNum(DATA.declared_value)){
		return fmtErr("Invalid declared_value amount")
	}
	
	if (!isValidNum(DATA.paid_customs)){
		return fmtErr("Invalid paid_customs amount")
	}
	
	

	return new Response("hola")

})

function fmtErr(msg:string) {
	return NextResponse.json({message:"Formatting error in the add request "+msg},{status:422})
}

const isValidNum = (n:number) => n>= 0 && !isNaN(n)
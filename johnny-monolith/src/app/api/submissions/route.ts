import { getSubmissionCount, listSubmissions } from "@/app/lib/submissions";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
	const params = req.nextUrl.searchParams

	const page = params.get("page") || '1'
	const p = parseInt(page,10)
	let limit = params.get("limit")
	
	limit = limit ? limit : "15"
	
	const l = parseInt(limit,10)
	if (l && l < 10 || l > 50) {
		return Response.json ({error: "Limit must be between 10 and 50"}, {status: 400})
	}

	const o = p * l -l
	if (o && o < 0) {
		return Response.json ({error: "Offset must be a positive number"}, {status: 400})
	}

	const submissions = await listSubmissions(l, o, true)
	const total = await getSubmissionCount()

	return Response.json({submissions, total}, {status: 200})
}
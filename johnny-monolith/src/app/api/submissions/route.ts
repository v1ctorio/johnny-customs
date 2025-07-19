import { listSubmissions } from "@/app/lib/submissions";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
	const params = req.nextUrl.searchParams

	const offset = params.get("offset")
	let limit = params.get("limit")
	
	limit = limit ? limit : "15"
	
	const l = parseInt(limit,10)
	if (l && l < 10 || l > 50) {
		return Response.json ({error: "Limit must be between 10 and 50"}, {status: 400})
	}

	const o = offset ? parseInt(offset,10) : 0
	if (o && o < 0) {
		return Response.json ({error: "Offset must be a positive number"}, {status: 400})
	}

	const submissions = await listSubmissions(l, o, true)

	return Response.json(submissions, {status: 200})
}
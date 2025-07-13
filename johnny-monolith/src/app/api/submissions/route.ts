import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
	const params = req.nextUrl.searchParams

	const offset = params.get("offset")
	let limit = params.get("limit")
	limit = limit ? limit : ""
	
	let l = parseInt(limit)
	if (limit && limit < 10 || limit > 50)
}
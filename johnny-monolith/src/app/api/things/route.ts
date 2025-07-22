import { getThings } from "@/app/lib/things";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {

		const things = await getThings()

		return Response.json(things)
	
}
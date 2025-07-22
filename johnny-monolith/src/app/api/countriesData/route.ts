import { getCountriesData } from "@/app/lib/constants";

export async function GET() {
	return await Response.json(await getCountriesData())
}
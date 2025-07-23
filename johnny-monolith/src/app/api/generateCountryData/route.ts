import { countriesData } from "@/db/schema";
import { pullUSDJson } from "@/app/lib/money";
import { countries, countryToCurrency, validCountryCodes } from "@/app/lib/constants";

import { db } from "@/db/drizzle"
import { NextRequest } from "next/server";
import { sql } from "drizzle-orm";

const JC_ADMIN_API_TOKEN = process.env.JC_ADMIN_API_TOKEN 

type countryType = typeof countriesData.$inferInsert
export async function GET(req: NextRequest) {

	const auth = req.nextUrl.searchParams.get("token") || ""

	if (auth !== JC_ADMIN_API_TOKEN) {
		return new Response(`Invalid or missing credentials`, {status:401})
	}
const USDJson = await pullUSDJson()	

const cData: countryType[] = Object.keys(countries).map(c => {
		const currency = countryToCurrency[c as keyof typeof countryToCurrency];
		if (!currency) {return null};
	
		return {
		full_name: countries[c as validCountryCodes],
		iso3316_1a2: c,
		iso4217: currency,
		inverseRate: USDJson[currency.toLowerCase()]?.inverseRate ?? 1
	}
}).filter((item): item is countryType => item !== null);


await db.execute(sql`TRUNCATE TABLE ${countriesData}`)
await db.insert(countriesData).values(cData)

return new Response(`Succesfully updated`)
}



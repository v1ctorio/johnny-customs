import { countries, countryToCurrency, validCountryCodes } from "./app/lib/constants";

import { db } from "@/db/drizzle"
import { pullUSDJson } from "./app/lib/money";
import { countriesData } from "./db/schema";


type countryType = typeof countriesData.$inferInsert
export async function register() {
const USDJson = await pullUSDJson()	

const cData: countryType[] = Object.keys(countries).map(c => {
	  const currency = countryToCurrency[c as keyof typeof countryToCurrency];
    if (!currency) {return null};
	
		return {
		full_name: countries[c as validCountryCodes],
		iso3316_1a2: c,
		iso4217: currency,
		ínverseRate: USDJson[currency.toLowerCase()].inverseRate
	}
}).filter((item): item is countryType => item !== null);

await db.insert(countriesData).values(cData)
}



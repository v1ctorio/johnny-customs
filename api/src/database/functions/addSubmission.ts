import type { apiSubmission } from '../../types/api_submission';
import database from '../index';

import countryToCurrency from 'country-to-currency';
import { submissions_table } from '../schema';
import { convertCurrency } from '../utils/convert';
import iso2Country from '../utils/iso2CountryCodes.json' 
export default async function addSubmission(submission: apiSubmission) {
	if (isValidCountryCode(submission.country_code) === false) {
		throw new Error("Invalid country code");
	}

	const currency_code = countryToCurrency[submission.country_code as keyof typeof countryToCurrency];
	const declared_value_usd = await convertCurrency(currency_code, 'USD', submission.declared_value);
	const paid_customs_usd = await convertCurrency(currency_code, 'USD', submission.paid_customs);

	const country_full_name = iso2Country[submission.country_code as keyof typeof iso2Country];

	const new_submission: typeof submissions_table.$inferInsert = {
		user: submission.user,
		item: submission.item,
		submission_date: submission.submission_date,
		declared_value: submission.declared_value,
		declared_value_usd,
		paid_customs: submission.paid_customs,
		paid_customs_usd,
		country_code: submission.country_code,
		country_full_name,
		additional_information: submission.additional_information,
		currency: currency_code
	}

	await database.insert(submissions_table).values(new_submission).execute();

	//console.log(`Added submission with ID ${JSON.stringify(db_submission)}`);
	return true;
}

function isValidCountryCode(country_code: string): boolean {
	const country_codes = Object.keys(iso2Country);
	return country_codes.includes(country_code);
}


///test

// const DB_FILE_NAME = 'file:local.db';

// var dab = drizzle(DB_FILE_NAME);

// addSubmission(dab, {
// 	user: "user",
// 	item: "item",
// 	submission_date: 123,
// 	declared_value: 123,
// 	country_code: "ES",
// 	paid_customs: 12,
// 	additional_information: "info"
// })
// Works! yay
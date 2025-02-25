import type { apiSubmission } from '../../types/api_submission';
import database from '../index';

import { submissions_table } from '../schema';
import { convertCurrency } from '../utils/convert';

export default async function addSubmission(submission: apiSubmission) {
	if (isValidCountryCode(submission.country_code) === false) {
		throw new Error("Invalid country code");
	}
	const currency_code = 'EUR' //TODO map country code to currency code 

	const declared_value_usd = await convertCurrency(currency_code, 'USD', submission.declared_value);
	const paid_customs_usd = await convertCurrency(currency_code, 'USD', submission.paid_customs);

	const new_submission: typeof submissions_table.$inferInsert = {
		user: submission.user,
		item: submission.item,
		submission_date: submission.submission_date,
		declared_value: submission.declared_value,
		declared_value_usd,
		paid_customs: submission.paid_customs,
		paid_customs_usd,
		country_code: submission.country_code,
		additional_information: submission.additional_information,
	}

	await database.insert(submissions_table).values(new_submission).execute();

	//console.log(`Added submission with ID ${JSON.stringify(db_submission)}`);
	return true;
}

function isValidCountryCode(country_code: string): boolean {
	const country_codes = ["AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","HR","CU","CW","CY","CZ","CI","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RO","RU","RW","RE","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW","AX"]
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
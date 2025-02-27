import database from '../index';

import { submissions_table } from '../schema';

import addSubmission from '../functions/addSubmission';

async function main() {
	console.log('The following script is going to add three test submissions to the database and delete everything else in 6 seconds.')
	
	await new Promise((resolve) => setTimeout(resolve, 6000));

	await database.delete(submissions_table).execute();

	
	addSubmission({
	user: "U072PTA5BNG",
	item: "Flipper zero",
	submission_date: Math.floor(Date.now() / 1000),
	declared_value: 20000,
	country_code: "ES",
	paid_customs: 1000,
	additional_information: "info"
	})

	addSubmission({
	user: "U072PTA5BNG",
	item: 'Raspberry Pi 4',
	submission_date: Math.floor(Date.now() / 1000)-2000,
	declared_value: 5000,
	country_code: "PT",
	paid_customs: 500,
	})

	addSubmission({
	user: "U07UH9DQA4B",
	item: 'Expensive item',
	submission_date: Math.floor(Date.now() / 1000)-1000,
	declared_value: 54366,
	country_code: "US",
	paid_customs: 4324,
	})

}

main();
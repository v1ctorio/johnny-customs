import database from '../index.js';

import { submissions_table } from '../schema.js';

import addSubmission from '../functions/addSubmission.js';

import fetch from 'node-fetch';
import app from '../../index.js';

async function main() {
	// console.log('The following script is going to add three test submissions to the database and delete everything else in 6 seconds.')
	
	// await new Promise((resolve) => setTimeout(resolve, 6000));

	// try {
	// 	await database.delete(submissions_table).execute();
	// } catch (error) {
	// 	console.error('Error deleting submissions:', error);
		
	// }

	
	function getRandomDate(start: Date, end: Date): number {
		const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
		console.log(randomDate.getTime());
		return randomDate.getTime();
	}

	const submissions = [
		{
			user: "U072PTA5BNG",
			item: "Flipper zero",
			country_code: "ES",
			country: "Spain",
			currency: "EUR",
			declared_value: 20000,
			declared_value_usd: 22000, // Example conversion rate
			paid_customs: 1000,
			paid_customs_usd: 1100, // Example conversion rate
			additional_information: "info",
			submission_date: getRandomDate(new Date(2020, 0, 1), new Date()),
		},
		{
			user: "U072PTA5BNG",
			item: 'Raspberry Pi 4',
			country_code: "PT",
			country: "Portugal",
			currency: "EUR",
			declared_value: 5000,
			declared_value_usd: 5500, // Example conversion rate
			paid_customs: 500,
			paid_customs_usd: 550, // Example conversion rate
			additional_information: "",
			submission_date: getRandomDate(new Date(2020, 0, 1), new Date()),
		},
		{
			user: "U07UH9224B",
			item: 'Expensive itasdasdem',
			country_code: "US",
			country: "United States",
			currency: "USD",
			declared_value: 54366,
			declared_value_usd: 54366,
			paid_customs: 4324,
			paid_customs_usd: 4324,
			additional_information: "",
			submission_date: getRandomDate(new Date(2020, 0, 1), new Date()),
		},
	];

  for (const submission of submissions) {
    try {
      const response = await fetch(`${process.env.API_URL || 'http://localhost:3000'}/submissions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SUBMISSIONS_API_KEY || 'supersecretkey',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error(`Failed to add submission: ${response.statusText}`);
      }

      console.log(`Added submission: ${submission.item}`);
    } catch (error) {
      console.error('Error adding submission:', error);
    }
  }
}

main();
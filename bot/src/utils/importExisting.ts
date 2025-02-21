import countryToCurrency from "country-to-currency";
import type submission from "../types/submission.js";
import _v1Data from "./v1data.json" assert { type: "json" };
import prisma from "db";
import { convertCurrency } from "./convert.js";
import { askAI } from "./ai.js";

const interfaceString = `interface submission {
  author: string // Slack ID
  item: string; //What item did you pay customs for
  country_code: Countries //ISO 3166-1 alpha-2 country code
  declared_value: money
  declared_value_usd: money
  paid_customs: money
  paid_customs_usd: money
  submission_date: number //UNIX timestamp
  additional_information: string //notes 
}`;

async function importData() {
  try {
    const v1Data = _v1Data.map((submission) => {
      return {
        author: submission.Author,
        item: submission["What did you pay customs for?"],
        country_code: submission["Country code (ISO A2)"].replace('IND', 'IN'),
        declared_value: submission["What was the declared value?"],
        paid_customs: submission["Paid customs"],
        paid_customs_usd: submission["Paid customs (USD)"],
        submission_date: 0,
        additional_information: submission.Notes,
      };
    }) as submission[];

    // process submissions
    const processedData = await Promise.all(
      v1Data.map(async (submission) => {
        if (
          submission.item === "" ||
          (submission.country_code as string) === ""
        ) {
          console.warn(`Skipping empty submission: ${JSON.stringify(submission)}`);
          return null;
        }

        if (submission.country_code.length !== 2) {
          console.warn(
            `Skipping invalid country code: ${submission.country_code}`
          );
          return null;
        }

        console.log("Processing:", submission.item);

        let processedSubmission = submission;
        try {
          const aiResponse =
            await askAI(`Convert the following json object to be according to the typescript interface.
              ${interfaceString}
              type "money" is number. convert country codes to ISO 3166-1 alpha-2 country codes. return ONLY the treated json object
              and nothing else.
              Here's the json object: ${JSON.stringify(submission)}
              MAKE SURE YOU ARE RETURNING A VALID JSON OBJECT, ACCORDING TO THE TYPESCRIPT INTERFACE AND THE JSON SPEC.`);
          const cleaned = aiResponse.replaceAll("```", "").replace("json", "");
          processedSubmission = JSON.parse(cleaned);

          const currency = countryToCurrency[processedSubmission.country_code];
          if (!currency) {
            throw new Error(
              `Invalid currency for country: ${processedSubmission.country_code}`
            );
          }

          processedSubmission.declared_value_usd = await convertCurrency(
            currency,
            "USD",
            processedSubmission.declared_value
          );
          if (processedSubmission.paid_customs_usd === 0) {
            processedSubmission.paid_customs_usd = await convertCurrency(
              currency,
              "USD",
              processedSubmission.paid_customs
            );
          }

          return processedSubmission;
        } catch (error) {
          console.error("Error processing submission:", submission.item, error);
          return null;
        }
      })
    );

    // filter null submissions
    const validSubmissions = processedData.filter(
      (s): s is submission => s !== null
    );

    // import valid submissions
    await Promise.all(
      validSubmissions.map((submission) =>
        prisma.chargeSubmission.create({
          data: submission,
        })
      )
    );

    console.log(`Successfully imported ${validSubmissions.length} submissions`);
  } catch (error) {
    console.error("Import failed:", error);
  }
}

// Execute the import
importData();

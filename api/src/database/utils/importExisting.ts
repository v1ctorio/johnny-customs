import countryToCurrency from "country-to-currency";
import type { apiSubmission as submission } from "../../types/api_submission.js";
import _v1Data from "./v1data.json" assert { type: "json" };
import database from "../index.js";
import { convertCurrency } from "./convert.js";
import { askAI } from "./ai.js";
import { submissions_table } from "../schema.js";

const interfaceString = `{
    user: string;
    item: string;
    submission_date: number;
    declared_value: number;
    declared_value_usd: number;
    paid_customs: number;
    paid_customs_usd: number;
    country_code: string;
    currency: string;
    additional_information?: string | undefined;
}`;

async function importData() {
  try {
    const v1Data = _v1Data.map((submission) => {
      const currency = countryToCurrency[submission["Country code (ISO A2)"].replace('IND', 'IN')] || '';
      return {
        user: submission.Author,
        item: submission["What did you pay customs for?"],
        country_code: submission["Country code (ISO A2)"].replace('IND', 'IN'),
        declared_value: Number(submission["What was the declared value?"]) || 0,
        declared_value_usd: 0,
        paid_customs: Number(submission["Paid customs"]) || 0,
        paid_customs_usd: Number(submission["Paid customs (USD)"]),
        submission_date: 0,
        currency: currency,
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
              type "money" is number. convert country codes to ISO 3166-1 alpha-2 country codes.
              type "currency" is ISO 4217 currency code.
              return ONLY the treated json object and nothing else.
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
        database.insert(submissions_table).values(submission).execute()
      )
    );

    console.log(`Successfully imported ${validSubmissions.length} submissions`);
  } catch (error) {
    console.error("Import failed:", error);
  }
}

// Execute the import
importData();
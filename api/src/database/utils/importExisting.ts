import countryToCurrency from "country-to-currency";
import type { apiSubmission as submission } from "../../types/api_submission.js";
import { askAI } from "./ai.js";
import { submission_status, submissions_table } from "../schema.js";
import addSubmission from "../functions/addSubmission.js";
import { readFile } from "node:fs/promises";
import neatCsv, { type Row } from 'neat-csv';

const interfaceString = `{
  user: string;
  item: string;
  country_code: string;
  country: string;
  currency: string;
  declared_value: number;
  declared_value_usd: number;
  paid_customs: number;
  paid_customs_usd: number;
  submission_date?: number | undefined;
  additional_information?: string | undefined;
  approved?: number | undefined;
}`;

async function importData() {
  const _v1Data: Row[] = [];
  try {
    const v1csvcontent = await neatCsv(await readFile('./src/database/utils/v1data.csv', 'utf8'))
    _v1Data.push(...v1csvcontent) 
  } catch{
    console.error("Error reading v1data.csv, trying to read v1data.json")
    try {
      const v1jsoncontent = await readFile('./v1data.json', 'utf8')
      _v1Data.push(...JSON.parse(v1jsoncontent))
    } catch {
      console.error("Error reading v1data.json, aborting")
      process.exit(1)
    }
  } 

  console.log(_v1Data)
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
        approved: 0,
      } as submission;
    });

    // process submissions
    let progress = 0;
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
              "country" is the country name.
              DO NOT TOUCH THE "approved" VALUE.
              do NOT convert currencies, and put the decimals right.
              add trailing zeros to the right of the decimal point if necessary.
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

          progress += 1 / v1Data.length;
          printProgress(progress);
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
      validSubmissions.map( async (submission) =>
        await addSubmission(submission, submission_status.APPROVED)
      )
    );

    console.log(`Successfully imported ${validSubmissions.length} submissions`);
  } catch (error) {
    console.error("Import failed:", error);
  }
}

function asciiProgressbar(progress: number, length: number) {
  const progressChars = Math.floor(progress * length);
  const bar = Array.from({ length }, (_, i) =>
    i < progressChars ? "█" : "░"
  ).join("");
  return bar;
}

function printProgress(progress: number) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${asciiProgressbar(progress, 20)} ${Math.round(progress * 100)}%`);
}

importData();
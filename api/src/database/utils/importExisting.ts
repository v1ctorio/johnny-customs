//!BROKEN
import countryToCurrency from "country-to-currency";
import type { apiSubmission as submission } from "../../types/api_submission.js";
import database from "../index.js";
import { convertCurrency } from "./convert.js";
import { askAI } from "./ai.js";
import { submission_status, submissions_table } from "../schema.js";
import addSubmission from "../functions/addSubmission.js";
import { readFile, readdir } from "fs/promises";

const interfaceString = `{
    user: string;
    item: string;
    submission_date: number;
    declared_value: number;
    paid_customs: number;
    country_code: string;
    currency: string;
    additional_information?: string | undefined;
}`;

async function importData() {

  const _v1Data:any = [];
  try {
    const currentDirFiles = await readdir('./',)
    console.log(currentDirFiles)
    const v1csvcontent = await readFile('./v1data.csv', 'utf8')
    _v1Data.push(...csvToJson(v1csvcontent) as submission[]) 
  } catch{
    console.error("Error reading v1data.csv, trying to read v1data.json")
    try {
      const v1jsoncontent = await readFile('./v1data.json', 'utf8')
      _v1Data.push(...JSON.parse(v1jsoncontent) as submission[])

    } catch {
      console.error("Error reading v1data.json, aborting")
      process.exit(1)
    }
  } 

  console.log(_v1Data)
  try {
    const v1Data = _v1Data.map((submission) => {
      console.log(submission)
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


function csvToJson(csv: string): Object[] {
  const lines = csv.split('\n')
  const result: Object[] = []
  const headers = lines[0].split(',').map((header) => header.replace('"','').replace('"',''))
  for (let i = 1; i < lines.length; i++) {        
      if (!lines[i])
          continue
      const obj: Object = {}
      const currentline = lines[i].split(',')

      for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j] ?? '' 
      }
      result.push(obj)
  }
  return result
}

// Execute the import
importData();
import { config } from "dotenv-vault";
import fs from "node:fs";
config();

const { EXCHANGE_API_KEY } = process.env;

if (!EXCHANGE_API_KEY) {
  throw new Error("Missing EXCHANGE_API_KEY");
}

interface Currency {
  conversion_rates: { [key: string]: number };
}

const API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function getCurrencies(): Promise<any> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching currency data:", error);
    throw error;
  }
}

let currenciesRequest: Currency;

getCurrencies()
  .then((data) => {
    currenciesRequest = data;
    console.log(currenciesRequest);

    const rates = currenciesRequest.conversion_rates;
    console.log(rates);
    console.log(rates.USD);
    if (rates.USD === 1) {
      fs.writeFile(
        "src/utils/currency.json",
        JSON.stringify(rates, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to currency.json:", err);
          } else {
            console.log("Currency rates successfully written to currency.json");
          }
        }
      );
    } else {
      console.error("Error fetching data: USD is not 1");
    }
  })
  .catch((error) => {
    console.error(error);
  });
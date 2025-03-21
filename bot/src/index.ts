import Slack from "@slack/bolt";
const { App, subtype } = Slack;

import { init } from 'shrimple-env';
import _isoModalOptions from "./utils/isoModalOptions.json" with { type: "json" };
import _currencies from "./utils/currency.json" with { type: "json" };
import _iso2CountryCodes from "./utils/iso2CountryCodes.json" with { type: "json" };
import _countryCurrency from "./utils/countryToCurrency.json" with { type: "json" };

await init({
	envFiles: ['../.env']
})

const APPROVAL_CHANNEL = process.env.APPROVAL_CHANNEL || "C08EL3S67BN";

const iso2CountryCodes: { [key: string]: string } = _iso2CountryCodes;
const countryCurrency: { [key: string]: string } = _countryCurrency;
const currencies: { [key: string]: number } = _currencies;

const {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_APP_TOKEN,
  SLACK_CLIENT_SECRET,
} = process.env;

const slack = new App({
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  signingSecret: SLACK_SIGNING_SECRET,
  port: 6777,
  clientSecret: SLACK_CLIENT_SECRET,
});

function toUSD(amount: number, currency: string): number {
  const rate: number = currencies[currency] || 1;
  return Math.round((amount / rate) * 100) / 100;
}

slack.command(
  "/test-command",
  async ({ ack, body, client, logger }) => {
    await ack();

    try {
      console.log("Opening modal");
      console.log(body);
      console.log(body.trigger_id);
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        // Payload
        view: {
          type: "modal",
          callback_id: "view_1",
          title: {
            type: "plain_text",
            text: "Customs Submission",
          },
          blocks: [
            {
              type: "input",
              block_id: "item_input",
              label: {
                type: "plain_text",
                text: "What did you pay customs for?",
              },
              element: {
                type: "plain_text_input",
                action_id: "dreamy_input",
                multiline: false,
              },
            },
            {
              type: "input",
              block_id: "declared_input",
              label: {
                type: "plain_text",
                text: "What was the declared value? (in your local currency)",
              },
              element: {
                type: "plain_text_input",
                action_id: "dreamy_input",
              },
            },
            {
              type: "input",
              block_id: "paid_input",
              label: {
                type: "plain_text",
                text: "Paid customs (in your local currency)",
              },
              element: {
                type: "plain_text_input",
                action_id: "dreamy_input",
              },
            },
            {
              type: "input",
              block_id: "iso_input",
              label: {
                type: "plain_text",
                text: "ISO2 country code (e.g. US, IN, CA) ",
              },
              hint: {
                type: "plain_text",
                text: "Refer to https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements for the list of codes.",
              },
              element: {
                type: "plain_text_input",
                action_id: "dreamy_input",
              },
            },
            {
              type: "input",
              block_id: "notes_input",
              label: {
                type: "plain_text",
                text: "Additional information",
              },
              element: {
                type: "plain_text_input",
                action_id: "dreamy_input",
                multiline: true,
              },
              optional: true,
            },
          ],
          submit: {
            type: "plain_text",
            text: "Submit",
          },
        },
      });
      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  }
);

slack.view("view_1", async ({ ack, body, view, logger, client }) => {
  await ack();
  console.log("View submitted");

  const item: string = view.state.values.item_input.dreamy_input.value ?? "";
  const declared: number = Number.parseFloat(view.state.values.declared_input.dreamy_input.value ?? "") || 0;
  const paid: number = Number.parseFloat(view.state.values.paid_input.dreamy_input.value ?? "") || 0;
  const iso: string = (view.state.values.iso_input.dreamy_input.value ?? "").toUpperCase();
  const notes: string = view.state.values.notes_input.dreamy_input.value ?? "";
  const currency = countryCurrency[iso] || "Unknown currency";
  const user = body.user.id;

  const country = iso
    ? iso2CountryCodes[iso] || "Unknown country"
    : "Unknown country";

	if (country === "Unknown country" || currency === "Unknown currency") {
    await client.chat.postEphemeral({
      channel: "C08EL3S67BN",
      user: body.user.id,
      text: `The provided ISO2 country code (${iso}) is invalid. Please refer to [this link](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) for all the valid codes.`,
    });
		return;
	}

  const declaredUSD = toUSD(declared, currency);
  const paidUSD = toUSD(paid, currency);


  logger.info("View submitted");
  logger.info(`Item: ${item}`);
  logger.info(`Declared Value: ${declared} (${currency})`);

  logger.info(`Paid Customs: ${paid} (${currency})`);
  logger.info(`Paid Customs: ${paidUSD} (USD)`);
  logger.info(`ISO2 Country Code: ${iso}`);
  logger.info(`Country: ${country}`);
  logger.info(`Currency: ${currency}`);
  logger.info(`Notes: ${notes}`);

  try {

    /* await prisma.chargeSubmission.create({
    data: {
      author: user,
      item: item,
      country_code: iso,
      country: country,
      currency: currency,
      declared_value: declared,
      declared_value_usd: declaredUSD,  
      paid_customs: paid,
      paid_customs_usd: paidUSD,
      additional_information: notes,
            },
          }); */
    const response = await fetch(`${process.env.API_URL || 'http://localhost:3000'}/submissions/add`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.SUBMISSIONS_API_KEY || 'supersecretkey',
      },
      body: JSON.stringify({
      user,
      item,
      country_code: iso,
      country,
      currency,
      declared_value: declared,
      declared_value_usd: declaredUSD,
      paid_customs: paid,
      paid_customs_usd: paidUSD,
      additional_information: notes,
      }),
    });

    const result = await response.json();
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  await slack.start();
  console.log("Slack bot is running");
})();

import Slack from "@slack/bolt";
const { App, subtype } = Slack;

import { config } from "dotenv";
import fs from "fs";
import path from "path";
import _isoModalOptions from "./utils/isoModalOptions.json" assert { type: "json" };
import _iso2CountryCodes from "./utils/iso2CountryCodes.json" assert { type: "json" };
import { createTypeReferenceDirectiveResolutionCache } from "typescript";
import { lookup } from "dns";
config();

interface CountryCodes {
  [key: string]: string;
}

const iso2CountryCodes: CountryCodes = _iso2CountryCodes;

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

slack.command(
  "/test-command",
  // Listen for a slash command invocation
  async ({ ack, body, client, logger }) => {
    await ack();

    try {
      console.log("Opening modal");
      console.log(body);
      console.log(body.trigger_id);

      const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: body.trigger_id,
        // View payload
        view: {
          type: "modal",
          // View identifier
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

  const item = view.state.values.item_input.dreamy_input.value ?? "";
  const declared = view.state.values.declared_input.dreamy_input.value ?? "";
  const paid = view.state.values.paid_input.dreamy_input.value ?? "";
  const iso: string = view.state.values.iso_input.dreamy_input.value ?? "";
  const notes = view.state.values.notes_input.dreamy_input.value ?? "";


  const country = iso
    ? iso2CountryCodes[iso] || "Unknown country"
    : "Unknown country";

  logger.info("View submitted");
  logger.info(`Item: ${item}`);
  logger.info(`Declared Value: ${declared}`);
  logger.info(`Paid Customs: ${paid}`);
  logger.info(`ISO2 Country Code: ${iso}`);
  logger.info(`Country: ${country}`);
  logger.info(`Notes: ${notes}`);
});

(async () => {
  await slack.start();
  console.log("Slack bot is running");
})();


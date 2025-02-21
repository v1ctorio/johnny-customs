import Slack from "@slack/bolt";
const { App, subtype } = Slack;

import { config } from "dotenv";
import fs from "fs";
import path from "path";
import _isoModalOptions from "./utils/isoModalOptions.json" assert { type: "json" };
config();

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
						text: "Modal title",
					},
					blocks: [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "Welcome to a modal with _blocks_",
							},
							accessory: {
								type: "button",
								text: {
									type: "plain_text",
									text: "Click me!",
								},
								action_id: "button_abc",
							},
						},
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
								text: "What was the declared value?",
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
								text: "Paid customs",
							},
							element: {
								type: "plain_text_input",
								action_id: "dreamy_input",
							},
						},
						{
							type: "input",
							block_id: "iso_select_input",
							label: {
								type: "plain_text",
								text: "Select an option",
							},
							element: {
								type: "static_select",
								action_id: "iso_select_action",
								options: _isoModalOptions.slice(0, 100).map(option => ({ // Slice 100 bc it's slack max
									text: {
										type: "plain_text",
										text: option.text.text,
									},
									value: option.value,
								})),
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

slack.view("view_1", async ({ ack, body, view, logger }) => {
	await ack();
	console.log("View submitted");
	console.log(view);
});

(async () => {
  await slack.start();
  console.log("Slack bot is running");
})();

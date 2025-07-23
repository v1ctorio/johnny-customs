"use server";

export async function sendToSlack(data: string | object): Promise<void> {

	let DATA: string

	if (typeof data === 'object') {
		DATA = JSON.stringify(data);
	} else if (typeof data == 'string') {
		DATA = JSON.stringify({ text: data });
	} else {
		DATA = ""
	}

	const webhookUrl: string = process.env.SLACK_WEBHOOK_URL || '';

	fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(DATA),
	})
	
}
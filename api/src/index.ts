import { Hono } from 'hono'
import drizzle from './database';
import addSubmission from './database/functions/addSubmission';
import { type apiSubmission, apiSubmissionSchema } from './types/api_submission';
import listSubmissions from './database/functions/listSubmissions';

const API_KEY = "supersecretapikey";

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello CHAT!')
})

app.get('/submissions', async (c) => {
	const page = Number(c.req.query('page')) || 1;
	const limit = Number(c.req.query('limit')) || 20;

	const submissions = await listSubmissions({
		skip: (page - 1) * limit,
		take: limit,
	});

	return c.json(submissions);
})

app.post('/submissions/add', async (c) => {
	const apiKey = c.req.header('x-api-key');
	if (apiKey !== API_KEY) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	const body = await c.req.json();
	
	const submission = apiSubmissionSchema.safeParse(body);
	if (!submission.success) {
		return c.json({ error: 'Invalid submission' }, 400);
	}

	try {
		await addSubmission(submission.data);
	}
	catch (error) {
		return c.json({ error: 'Internal server error' }, 500);
	}
});

export default app

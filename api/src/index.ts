import { Hono } from 'hono'
import addSubmission from './database/functions/addSubmission.js';
import { apiSubmissionSchema } from './types/api_submission.js';
import listSubmissions from './database/functions/listSubmissions.js';
import removeSubmission from './database/functions/removeSubmission.js';
import getSubmission from './database/functions/getSubmission.js';
import { init } from 'shrimple-env';
import { logger } from 'hono/logger';
import getItems from './database/functions/getItems.js';

await init({
	envFiles: ['../.env']
})


const API_KEY = process.env.SUBMISSIONS_API_KEY;

const app = new Hono()
app.use(logger())

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
	console.log(body);
	
	const submission = apiSubmissionSchema.safeParse(body);
	console.log(submission);
	if (!submission.success) {
		console.error('Invalid submission:', submission.error);
		return c.json({ error: 'Invalid submission' }, 400);
	}

	try {
		await addSubmission(submission.data);
	}
	catch (error) {
		console.error('Error adding submission:', error);
		return c.json({ error: 'Internal server error' }, 500);
	}
});

app.delete('/submissions/:id', async (c) => {
	const apiKey = c.req.header('x-api-key');

	if (apiKey !== API_KEY) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	try {
		await removeSubmission(Number(c.req.param('id')));

		return c.json({ success: true });
	} catch (error) {
		return c.json({ error: 'Internal server error' }, 500);
	}

	
});

app.get('/submissions/:id', async (c) => {
	const submission = await getSubmission(Number(c.req.param('id')));

	if (!submission) {
		return c.json({ error: 'Submission not found' }, 404);
	}

	return c.json(submission);
})

app.get('/items', async (c) => {
	try {
		const items = await getItems()
		return c.json(items)
	} catch (error) {
		return c.json({ error: 'Internal server error' }, 500)
	}
})


if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
	const { serve } = await import('@hono/node-server')
	serve(app, i => console.log(`Server listening on port ${i.port}`))
}

export default app

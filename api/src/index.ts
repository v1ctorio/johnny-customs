import { Hono } from 'hono'
import prisma from 'db'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello CHAT!')
})

app.get('/submissions', async (c) => {
	const users = await prisma.user.findMany()
	return c.json(users)
})

export default app

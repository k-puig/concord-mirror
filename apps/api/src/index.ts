import { prisma } from '@concord/database'; // types from prisma
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

// Health check
app.get('/', (c) => {
  return c.json({ ok: true, message: 'Hello from the Concord API' });
});

// route to get all users
const usersRoute = app.get('/users', async (c) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      nickname: true,
      createdAt: true,
    },
  });
  return c.json(users);
});

const port = Number.parseInt(process.env.PORT || '3000');
console.log(`API server listening on port ${port}`);

// This exports the type of our app's routes,
// which the client can use for end-to-end type safety.
export type AppType = typeof usersRoute;

export default {
  port: 3000,
  fetch: app.fetch,
};

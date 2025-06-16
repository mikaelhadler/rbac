import t from 'tap';
import Fastify from 'fastify';
import prismaPlugin from '../src/plugins/prisma.js';
import authPlugin from '../src/plugins/auth.js';
import permissionsPlugin from '../src/plugins/permissions.js';
import authRoutes from '../src/routes/auth.js';

const build = async () => {
  const app = Fastify();
  await app.register(prismaPlugin);
  await app.register(authPlugin);
  await app.register(permissionsPlugin);
  await app.register(authRoutes);
  await app.ready();
  return app;
};

t.test('login fails with invalid credentials', async t => {
  const app = await build();
  const res = await app.inject({
    method: 'POST',
    url: '/login',
    payload: { email: 'nope@example.com', password: 'bad' }
  });
  t.equal(res.statusCode, 401);
  await app.close();
});

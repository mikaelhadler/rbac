import Fastify from 'fastify';
import pgPlugin from './plugins/db.js';
import rbacPlugin from './plugins/rbac.js';

const fastify = Fastify({ logger: true });

await fastify.register(pgPlugin);
await fastify.register(rbacPlugin);

fastify.get('/', async () => ({ status: 'ok' }));

fastify.get('/admin', {
  preHandler: fastify.rbac.requireRole('admin'),
}, async () => {
  return { message: 'hello admin' };
});

fastify.get('/profile', {
  preHandler: fastify.rbac.requireRole('user'),
}, async (request) => {
  const user = await fastify.pg.query(
    'SELECT id, email FROM users WHERE id=$1',
    [request.user.id]
  );
  return { profile: user.rows[0] };
});

try {
  await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

import Fastify from 'fastify';
import cors from '@fastify/cors';
import prismaPlugin from './src/plugins/prisma.js';
import authPlugin from './src/plugins/auth.js';
import permissionsPlugin from './src/plugins/permissions.js';
import authRoutes from './src/routes/auth.js';
import usersRoutes from './src/routes/users.js';
import residentsRoutes from './src/routes/residents.js';
import complaintsRoutes from './src/routes/complaints.js';
import rolesRoutes from './src/routes/roles.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true,
  credentials: true,
});

await fastify.register(prismaPlugin);
await fastify.register(authPlugin);
await fastify.register(permissionsPlugin);

await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(usersRoutes, { prefix: '/api' });
await fastify.register(residentsRoutes, { prefix: '/api' });
await fastify.register(complaintsRoutes, { prefix: '/api' });
await fastify.register(rolesRoutes, { prefix: '/api' });

fastify.get('/', async () => ({ status: 'ok' }));

try {
  await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

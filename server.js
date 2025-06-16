import Fastify from 'fastify';
import prismaPlugin from './src/plugins/prisma.js';
import authPlugin from './src/plugins/auth.js';
import permissionsPlugin from './src/plugins/permissions.js';
import authRoutes from './src/routes/auth.js';
import usersRoutes from './src/routes/users.js';
import residentsRoutes from './src/routes/residents.js';
import complaintsRoutes from './src/routes/complaints.js';

const fastify = Fastify({ logger: true });

await fastify.register(prismaPlugin);
await fastify.register(authPlugin);
await fastify.register(permissionsPlugin);

await fastify.register(authRoutes);
await fastify.register(usersRoutes);
await fastify.register(residentsRoutes);
await fastify.register(complaintsRoutes);

fastify.get('/', async () => ({ status: 'ok' }));

try {
  await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

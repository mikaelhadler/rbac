import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import bcrypt from 'bcrypt';

async function authPlugin(fastify) {
  await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
      const id = request.user.sub;
      request.user = await fastify.prisma.user.findUnique({
        where: { id },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });
    } catch (err) {
      reply.code(401).send({ error: 'unauthorized' });
    }
  });

  fastify.decorate('login', async (email, password) => {
    const user = await fastify.prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;
    return fastify.jwt.sign({ sub: user.id, role: user.role.name });
  });
}

export default fp(authPlugin);

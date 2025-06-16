import fp from 'fastify-plugin';

async function permissionsPlugin(fastify) {
  fastify.decorate('hasPermission', perm => async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({ error: 'unauthorized' });
      return;
    }
    const allowed = request.user.role.permissions.some(p => p.permission.name === perm);
    if (!allowed) {
      reply.code(403).send({ error: 'forbidden' });
    }
  });
}

export default fp(permissionsPlugin);

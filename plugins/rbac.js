import fp from 'fastify-plugin';

async function rbacPlugin(fastify) {
  fastify.decorateRequest('user', null);
  fastify.decorate('rbac', {
    async verifyUser(request) {
      const userId = request.headers['user-id'];
      if (!userId) return null;
      const { rows } = await fastify.pg.query(
        'SELECT id, email FROM users WHERE id=$1',
        [userId]
      );
      request.user = rows[0];
      if (!request.user) return null;
      const rolesRes = await fastify.pg.query(
        'SELECT role_name FROM user_roles WHERE user_id=$1',
        [userId]
      );
      request.user.roles = rolesRes.rows.map(r => r.role_name);
      return request.user;
    },
    requireRole(role) {
      return async function (request, reply) {
        if (!request.user) {
          await fastify.rbac.verifyUser(request);
        }
        if (!request.user || !request.user.roles.includes(role)) {
          reply.code(403).send({ error: 'forbidden' });
        }
      };
    }
  });

  fastify.addHook('preHandler', async (request) => {
    await fastify.rbac.verifyUser(request);
  });
}

export default fp(rbacPlugin);

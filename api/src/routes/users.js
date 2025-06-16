export default async function (fastify) {
  fastify.get('/users/me', { preHandler: fastify.authenticate }, async (request) => {
    const { passwordHash, ...rest } = request.user;
    return rest;
  });

  fastify.get('/users', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async () => {
    return fastify.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });
  });
}

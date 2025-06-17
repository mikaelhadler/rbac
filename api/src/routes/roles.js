export default async function (fastify) {
  fastify.get('/roles', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async () => {
    return fastify.prisma.role.findMany({
      select: {
        id: true,
        name: true
      }
    });
  });
} 
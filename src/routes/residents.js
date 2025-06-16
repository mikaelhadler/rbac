export default async function (fastify) {
  fastify.get('/residents', {
    preHandler: [fastify.authenticate, fastify.hasPermission('create_resident')]
  }, async () => {
    return fastify.prisma.user.findMany({ where: { role: { name: 'resident' } } });
  });

  fastify.post('/residents', {
    preHandler: fastify.authenticate
  }, async (request) => {
    const { name } = request.body;
    return fastify.prisma.user.update({
      where: { id: request.user.id },
      data: { name }
    });
  });

  fastify.put('/residents/:id', {
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    const targetId = Number(request.params.id);
    if (request.user.id !== targetId) {
      await fastify.hasPermission('update_resident')(request, reply);
    }
    if (reply.sent) return;
    const { name } = request.body;
    return fastify.prisma.user.update({ where: { id: targetId }, data: { name } });
  });

  fastify.delete('/residents/:id', {
    preHandler: [fastify.authenticate, fastify.hasPermission('delete_resident')]
  }, async (request) => {
    const id = Number(request.params.id);
    await fastify.prisma.user.delete({ where: { id } });
    return { ok: true };
  });
}

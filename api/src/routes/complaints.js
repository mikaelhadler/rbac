export default async function (fastify) {
  fastify.post('/complaints', {
    preHandler: [fastify.authenticate, fastify.hasPermission('create_complaint')]
  }, async (request) => {
    const { text } = request.body;
    return fastify.prisma.complaint.create({ data: { text, userId: request.user.id, approved: false } });
  });

  fastify.put('/complaints/:id/approve', {
    preHandler: [fastify.authenticate, fastify.hasPermission('approve_complaint')]
  }, async (request) => {
    const id = Number(request.params.id);
    const { approved } = request.body;
    return fastify.prisma.complaint.update({ where: { id }, data: { approved } });
  });
}

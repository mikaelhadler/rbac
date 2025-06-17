import { logActivity } from '../plugins/activityLog.js'

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
    const updated = await fastify.prisma.user.update({
      where: { id: request.user.id },
      data: { name }
    });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'update',
      entity: 'resident',
      entityId: updated.id,
      details: `Updated own resident name to ${name}`
    })
    return updated;
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
    const updated = await fastify.prisma.user.update({ where: { id: targetId }, data: { name } });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'update',
      entity: 'resident',
      entityId: updated.id,
      details: `Updated resident ${updated.name}`
    })
    return updated;
  });

  fastify.delete('/residents/:id', {
    preHandler: [fastify.authenticate, fastify.hasPermission('delete_resident')]
  }, async (request) => {
    const id = Number(request.params.id);
    await fastify.prisma.user.delete({ where: { id } });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'delete',
      entity: 'resident',
      entityId: id,
      details: `Deleted resident ${id}`
    })
    return { ok: true };
  });

  fastify.get('/residents/count', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async () => {
    const count = await fastify.prisma.user.count({ where: { role: { name: 'resident' } } })
    return { count }
  })
}

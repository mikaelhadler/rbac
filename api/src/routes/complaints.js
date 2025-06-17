import { logActivity } from '../plugins/activityLog.js'

export default async function (fastify) {
  fastify.post('/complaints', {
    preHandler: [fastify.authenticate, fastify.hasPermission('create_complaint')]
  }, async (request) => {
    const { text } = request.body;
    const complaint = await fastify.prisma.complaint.create({ data: { text, userId: request.user.id, approved: false } });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'create',
      entity: 'complaint',
      entityId: complaint.id,
      details: `Created complaint: ${text}`
    })
    return complaint;
  });

  fastify.put('/complaints/:id/approve', {
    preHandler: [fastify.authenticate, fastify.hasPermission('approve_complaint')]
  }, async (request) => {
    const id = Number(request.params.id);
    const { approved } = request.body;
    const updated = await fastify.prisma.complaint.update({ where: { id }, data: { approved } });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'approve',
      entity: 'complaint',
      entityId: updated.id,
      details: `Complaint ${id} approved: ${approved}`
    })
    return updated;
  });

  fastify.get('/complaints/active', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async () => {
    const count = await fastify.prisma.complaint.count({ where: { approved: false } })
    return { count }
  })
}

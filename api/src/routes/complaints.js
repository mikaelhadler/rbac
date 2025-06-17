import { logActivity } from '../plugins/activityLog.js'

export default async function (fastify) {
  fastify.get('/complaints', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_complaints')]
  }, async () => {
    return fastify.prisma.complaint.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
  });

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

  fastify.put('/complaints/:id', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_complaints')]
  }, async (request) => {
    const id = Number(request.params.id);
    const { approved } = request.body;
    const updated = await fastify.prisma.complaint.update({
      where: { id },
      data: { approved },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'update',
      entity: 'complaint',
      entityId: updated.id,
      details: `Complaint ${id} ${approved ? 'approved' : 'rejected'}`
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

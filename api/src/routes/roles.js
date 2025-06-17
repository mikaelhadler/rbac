import { logActivity } from '../plugins/activityLog.js'

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

  fastify.post('/roles', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async (request, reply) => {
    const { name } = request.body;
    if (!name) {
      return reply.code(400).send({ error: 'Role name is required' });
    }
    // Verifica se já existe
    const existing = await fastify.prisma.role.findUnique({ where: { name } });
    if (existing) {
      return reply.code(400).send({ error: 'Role already exists' });
    }
    const role = await fastify.prisma.role.create({ data: { name } });
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'create',
      entity: 'role',
      entityId: role.id,
      details: `Created role ${role.name}`
    })
    return role;
  });

  fastify.put('/roles/:id', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async (request, reply) => {
    const id = Number(request.params.id)
    const { name } = request.body
    if (!name) {
      return reply.code(400).send({ error: 'Role name is required' })
    }
    // Verifica se já existe outro role com esse nome
    const existing = await fastify.prisma.role.findUnique({ where: { name } })
    if (existing && existing.id !== id) {
      return reply.code(400).send({ error: 'Role already exists' })
    }
    const updated = await fastify.prisma.role.update({ where: { id }, data: { name } })
    await logActivity(fastify, {
      userId: request.user.id,
      action: 'update',
      entity: 'role',
      entityId: updated.id,
      details: `Updated role ${updated.name}`
    })
    return updated
  })

  fastify.delete('/roles/:id', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async (request, reply) => {
    const id = Number(request.params.id)
    try {
      await fastify.prisma.role.delete({ where: { id } })
      return { ok: true }
    } catch (err) {
      return reply.code(400).send({ error: 'Failed to delete role' })
    }
  })
} 
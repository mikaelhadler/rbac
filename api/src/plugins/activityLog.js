export async function logActivity(fastify, { userId, action, entity, entityId, details }) {
  await fastify.prisma.activityLog.create({
    data: { userId, action, entity, entityId, details }
  })
} 
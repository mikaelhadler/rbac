export default async function (fastify) {
  fastify.get('/activity', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async () => {
    return fastify.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: { select: { name: true, email: true } } }
    })
  })
} 
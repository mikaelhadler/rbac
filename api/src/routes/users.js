import bcrypt from 'bcrypt';

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

  fastify.post('/users', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async (request, reply) => {
    const { name, email, password, roleId } = request.body;

    // Check if user already exists
    const existingUser = await fastify.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return reply.code(400).send({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await fastify.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        roleId: Number(roleId)
      },
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

    return user;
  });
}

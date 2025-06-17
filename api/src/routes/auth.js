export default async function (fastify) {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    const token = await fastify.login(email, password);
    if (!token) return reply.code(401).send({ error: 'invalid credentials' });

    const user = await fastify.prisma.user.findUnique({
      where: { email },
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

    return { token, user };
  });
}

export default async function (fastify) {
  fastify.get('/users/me', { preHandler: fastify.authenticate }, async (request) => {
    const { passwordHash, ...rest } = request.user;
    return rest;
  });
}

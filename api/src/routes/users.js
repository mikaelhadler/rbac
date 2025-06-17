import bcrypt from "bcrypt";
import { logActivity } from '../plugins/activityLog.js'

export default async function (fastify) {
  fastify.get(
    "/users/me",
    { preHandler: fastify.authenticate },
    async (request) => {
      const { passwordHash, ...rest } = request.user;
      return rest;
    }
  );

  fastify.get(
    "/users",
    {
      preHandler: [fastify.authenticate, fastify.hasPermission("manage_users")],
    },
    async () => {
      return fastify.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });
    }
  );

  fastify.post(
    "/users",
    {
      preHandler: [fastify.authenticate, fastify.hasPermission("manage_users")],
    },
    async (request, reply) => {
      const { name, email, password, roleId } = request.body;

      const existingUser = await fastify.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.code(400).send({ error: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await fastify.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          roleId: Number(roleId),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      await logActivity(fastify, {
        userId: request.user.id,
        action: 'create',
        entity: 'user',
        entityId: user.id,
        details: `Created user ${user.email}`
      })

      return user;
    }
  );

  fastify.put(
    "/users/:id",
    {
      preHandler: [fastify.authenticate, fastify.hasPermission("manage_users")],
    },
    async (request, reply) => {
      const userId = Number(request.params.id);
      const { name, email, password, roleId } = request.body;

      const existingUser = await fastify.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        return reply.code(404).send({ error: "User not found" });
      }

      if (email && email !== existingUser.email) {
        const emailTaken = await fastify.prisma.user.findUnique({
          where: { email },
        });
        if (emailTaken) {
          return reply.code(400).send({ error: "Email already in use" });
        }
      }

      let passwordHash;
      if (password) {
        passwordHash = await bcrypt.hash(password, 10);
      }

      const updatedUser = await fastify.prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(typeof roleId !== "undefined" && { roleId: Number(roleId) }),
          ...(passwordHash && { passwordHash }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      await logActivity(fastify, {
        userId: request.user.id,
        action: 'update',
        entity: 'user',
        entityId: updatedUser.id,
        details: `Updated user ${updatedUser.email}`
      })

      return updatedUser;
    }
  );

  fastify.delete(
    "/users/:id",
    {
      preHandler: [fastify.authenticate, fastify.hasPermission("manage_users")],
    },
    async (request, reply) => {
      const userId = Number(request.params.id);
      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      await fastify.prisma.user.delete({
        where: { id: userId },
      });

      await logActivity(fastify, {
        userId: request.user.id,
        action: 'delete',
        entity: 'user',
        entityId: userId,
        details: `Deleted user ${user.email}`
      });

      return { ok: true };
    }
  );

  fastify.get('/users/count', {
    preHandler: [fastify.authenticate, fastify.hasPermission('manage_users')]
  }, async () => {
    const count = await fastify.prisma.user.count()
    return { count }
  })
}

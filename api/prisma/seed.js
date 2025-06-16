import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'manage_users' },
      update: {},
      create: { name: 'manage_users' },
    }),
    prisma.permission.upsert({
      where: { name: 'manage_roles' },
      update: {},
      create: { name: 'manage_roles' },
    }),
    prisma.permission.upsert({
      where: { name: 'manage_complaints' },
      update: {},
      create: { name: 'manage_complaints' },
    }),
  ]);

  // Associate permissions with admin role
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Create admin user
  const passwordHash = await bcrypt.hash('!@ikzb5ssb666!@', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'mikaelhadler@gmail.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'mikaelhadler@gmail.com',
      passwordHash,
      roleId: adminRole.id,
    },
  });

  console.log('Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

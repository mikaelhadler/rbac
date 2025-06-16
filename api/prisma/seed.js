import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });
  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager' },
  });
  const residentRole = await prisma.role.upsert({
    where: { name: 'resident' },
    update: {},
    create: { name: 'resident' },
  });

  const perms = [
    'manage_everything',
    'approve_complaint',
    'create_resident',
    'update_resident',
    'delete_resident',
    'create_complaint',
  ];

  for (const name of perms) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const permMap = {
    admin: perms,
    manager: ['approve_complaint', 'create_resident', 'update_resident', 'delete_resident'],
    resident: ['create_resident', 'update_resident', 'create_complaint'],
  };

  for (const [role, names] of Object.entries(permMap)) {
    const roleId = (await prisma.role.findUnique({ where: { name: role } })).id;
    for (const name of names) {
      const permId = (await prisma.permission.findUnique({ where: { name } })).id;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId: permId } },
        update: {},
        create: { roleId, permissionId: permId },
      });
    }
  }

  const password = await bcrypt.hash('secret', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@example.com', passwordHash: password, roleId: adminRole.id },
  });
  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: { name: 'Manager', email: 'manager@example.com', passwordHash: password, roleId: managerRole.id },
  });
  await prisma.user.upsert({
    where: { email: 'resident@example.com' },
    update: {},
    create: { name: 'Resident', email: 'resident@example.com', passwordHash: password, roleId: residentRole.id },
  });
}

run().finally(() => prisma.$disconnect());

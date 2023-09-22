import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { users } from './seed-data';

const prisma = new PrismaClient();

async function seed() {
  console.log(`Seeding database...`);

  createUsers();

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createUsers() {
  for (const user of users) {
    console.log(`Creating user: ${user.email}`);
    await prisma.user.create({
      data: {
        ...user,
        password: {
          create: {
            hash: bcrypt.hashSync(user.password, 10),
          },
        },
      },
    });
  }
}

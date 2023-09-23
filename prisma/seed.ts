import { Organisation, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

let drakenfruit: Organisation;
let lodybo: Organisation;
let ministerieVanHuisvesting: Organisation;
let agencyForAmbition: Organisation;

async function seed() {
  console.log(`Seeding database...`);

  await createOrganisations();

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

async function createOrganisations() {
  lodybo = await prisma.organisation.create({
    data: {
      name: 'Lodybo',
      description: 'Lodybo, for all your software needs.',
      users: {
        create: [
          {
            email: 'hi@lodybo.nl',
            locale: 'nl',
            firstName: 'Lody',
            lastName: 'Borgers',
            role: 'MAINTAINER',
            password: {
              create: {
                hash: await bcrypt.hash('lodyiscool', 10),
              },
            },
          },
        ],
      },
      projects: {
        create: [],
      },
    },
  });

  drakenfruit = await prisma.organisation.create({
    data: {
      name: 'Drakenfruit',
      description: 'Drakenfruit, for diversity and inclusion.',
      users: {
        create: [
          {
            email: 'kaylee@drakenfruit.com',
            locale: 'nl',
            firstName: 'Kaylee',
            lastName: 'Rosalina',
            role: 'ADMIN',
            password: {
              create: {
                hash: await bcrypt.hash('kayleeiscool', 10),
              },
            },
          },
          {
            email: 'simone@drakenfruit.com',
            locale: 'nl',
            firstName: 'Simone',
            lastName: faker.person.lastName(),
            role: 'OFFICEMANAGER',
            password: {
              create: {
                hash: await bcrypt.hash('simoneiscool', 10),
              },
            },
          },
          {
            email: 'lisa@drakenfruit.com',
            locale: 'nl',
            firstName: 'Lisa',
            lastName: 'Jansen',
            role: 'CONSULTANT',
            password: {
              create: {
                hash: await bcrypt.hash('lisaiscool', 10),
              },
            },
          },
        ],
      },
      projects: {
        create: [],
      },
    },
  });

  ministerieVanHuisvesting = await prisma.organisation.create({
    data: {
      name: 'Ministerie van Huisvesting',
      description: 'Ministerie van Huisvesting, voor al uw huisvesting.',
      users: {
        create: [
          {
            email: 'silvia@ministerie.nl',
            locale: 'nl',
            firstName: 'Silvia',
            lastName: faker.person.lastName(),
            role: 'PROJECTLEADER',
            password: {
              create: {
                hash: await bcrypt.hash('silviaiscool', 10),
              },
            },
          },
        ],
      },
      projects: {
        create: [],
      },
    },
  });

  agencyForAmbition = await prisma.organisation.create({
    data: {
      name: 'Agency For Ambition',
      description: 'Agency For Ambition, for all your ambitions.',
      users: {
        create: [
          {
            email: faker.internet.email(),
            locale: 'en',
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            role: 'PROJECTLEADER',
            password: {
              create: {
                hash: await bcrypt.hash('password', 10),
              },
            },
          },
        ],
      },
      projects: {
        create: [],
      },
    },
  });
}

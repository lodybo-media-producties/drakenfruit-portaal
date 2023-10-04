import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  console.log(`Seeding database...`);

  await createOrganisations();
  await createCategories();
  await createArticles();
  await createTools();

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
  console.log('Creating Lodybo...');
  await prisma.organisation.create({
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

  console.log('Creating Drakenfruit...');
  await prisma.organisation.create({
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
            lastName: 'Leenders',
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

  console.log('Creating Ministerie van Huisvesting...');
  await prisma.organisation.create({
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

  console.log('Creating Agency For Ambition...');
  await prisma.organisation.create({
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

function createCategories() {
  console.log('Creating categories...');
  return prisma.category.createMany({
    data: [
      {
        name: {
          nl: 'Diversiteit',
          en: 'Diversity',
        },
        slug: {
          nl: 'diversiteit',
          en: 'diversity',
        },
        description: {
          nl: 'Diversiteit is een belangrijk onderwerp.',
          en: 'Diversity is an important topic.',
        },
      },
      {
        name: {
          nl: 'Inclusie',
          en: 'Inclusion',
        },
        slug: {
          nl: 'inclusie',
          en: 'inclusion',
        },
        description: {
          nl: 'Inclusie is een belangrijk onderwerp.',
          en: 'Inclusion is an important topic.',
        },
      },
    ],
  });
}

async function createArticles() {
  console.log('Creating articles...');

  console.log('Fetching Kaylee from the database...');
  const kaylee = await prisma.user.findUnique({
    where: {
      email: 'kaylee@drakenfruit.com',
    },
  });

  console.log('Fetching Simone from the database...');
  const simone = await prisma.user.findUnique({
    where: {
      email: 'simone@drakenfruit.com',
    },
  });

  if (!kaylee || !simone) {
    throw new Error('Kaylee or Simone not found');
  }

  console.log('Fetching categories from the database...');
  const categories = await prisma.category.findMany();

  console.log('Creating first article...');
  await prisma.article.create({
    data: {
      title: {
        nl: 'Diversiteit en Inclusie',
        en: 'Diversity and Inclusion',
      },
      slug: {
        nl: 'diversiteit-en-inclusie',
        en: 'diversity-and-inclusion',
      },
      summary: {
        nl: 'Diversiteit en inclusie zijn belangrijke onderwerpen.',
        en: 'Diversity and inclusion are important topics.',
      },
      content: {
        nl: 'Diversiteit en inclusie zijn belangrijke onderwerpen.',
        en: 'Diversity and inclusion are important topics.',
      },
      author: {
        connect: {
          id: kaylee!.id,
        },
      },
      categories: {
        connect: [
          {
            id: categories[0].id,
          },
        ],
      },
    },
  });

  console.log('Creating second article...');
  await prisma.article.create({
    data: {
      title: {
        nl: 'Inclusie en Diversiteit',
        en: 'Inclusion and Diversity',
      },
      slug: {
        nl: 'inclusie-en-diversiteit',
        en: 'inclusion-and-diversity',
      },
      summary: {
        nl: 'Inclusie en diversiteit zijn belangrijke onderwerpen.',
        en: 'Inclusion and diversity are important topics.',
      },
      content: {
        nl: 'Inclusie en diversiteit zijn belangrijke onderwerpen.',
        en: 'Inclusion and diversity are important topics.',
      },
      author: {
        connect: {
          id: simone!.id,
        },
      },
      categories: {
        connect: [
          {
            id: categories[1].id,
          },
        ],
      },
    },
  });
}

async function createTools() {
  console.log('Creating tools...');

  console.log('Fetching categories from the database...');
  const categories = await prisma.category.findMany();

  console.log('Creating first tool');
  await prisma.tool.create({
    data: {
      name: {
        nl: 'Inclusiviteitsscan',
        en: 'Inclusivity scan',
      },
      slug: {
        nl: 'inclusiviteitsscan',
        en: 'inclusivity-scan',
      },
      summary: {
        nl: 'De inclusiviteitsscan is een tool om de inclusiviteit van een organisatie te meten.',
        en: 'The inclusivity scan is a tool to measure the inclusivity of an organisation.',
      },
      description: {
        nl: faker.lorem.paragraph(),
        en: faker.lorem.paragraph(),
      },
      downloadUrl: '/tools/inclusiviteitsscan.pdf',
      categories: {
        connect: [
          {
            id: categories[1].id,
          },
          {
            id: categories[0].id,
          },
        ],
      },
    },
  });

  console.log('Creating second tool');
  await prisma.tool.create({
    data: {
      name: {
        nl: 'Inclusieve(re) projecten canvas',
        en: '(More) Inclusive project canvas',
      },
      slug: {
        nl: 'inclusievere-projecten-canvas',
        en: 'more-inclusive-project-canvas',
      },
      summary: {
        nl: 'Het inclusievere projecten canvas is een tool om de inclusiviteit van een project te meten.',
        en: 'The more inclusive project canvas is a tool to measure the inclusivity of a project.',
      },
      description: {
        nl: faker.lorem.paragraph(),
        en: faker.lorem.paragraph(),
      },
      downloadUrl: '/tools/inclusievere-projecten-canvas.pdf',
      categories: {
        connect: [
          {
            id: categories[0].id,
          },
        ],
      },
    },
  });
}

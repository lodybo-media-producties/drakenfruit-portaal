import { type Category, Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import CategoryWhereUniqueInput = Prisma.CategoryWhereUniqueInput;

const prisma = new PrismaClient();

async function seed() {
  console.log(`Seeding database...`);

  await createOrganisations();
  await createCategories();
  await createArticles();
  await createTools();
  await createProjects();

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
  console.log('Creating organisations, starting with known organisations');
  console.log('> Creating Drakenfruit...');
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
                type: 'ACTIVE',
              },
            },
          },
          {
            email: 'hi@lodybo.nl',
            locale: 'nl',
            firstName: 'Lody',
            lastName: 'Borgers',
            role: 'MAINTAINER',
            password: {
              create: {
                hash: await bcrypt.hash('lodyiscool', 10),
                type: 'ACTIVE',
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
                type: 'ACTIVE',
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
                type: 'ACTIVE',
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

  const totalOrgs = getRandomNumber();
  console.log(`> Creating ${totalOrgs} random organisations...`);
  for (let i = 0; i < totalOrgs; i++) {
    await prisma.organisation.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        users: {
          create: [
            {
              email: faker.internet.email(),
              locale: randomItem(['nl', 'en']),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              role: 'PROJECTLEADER',
              password: {
                create: {
                  hash: await bcrypt.hash('password', 10),
                  type: 'ACTIVE',
                },
              },
            },
          ],
        },
      },
    });
  }
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

  console.log('Creating articles...');
  const max = 20;
  for (let i = 0; i < max; i++) {
    console.log(`Creating article ${i + 1} of ${max}`);
    const creationDate = faker.date.past();
    await prisma.article.create({
      data: {
        title: {
          nl: faker.lorem.sentence(),
          en: faker.lorem.sentence(),
        },
        summary: {
          nl: faker.lorem.paragraph(),
          en: faker.lorem.paragraph(),
        },
        content: {
          nl: faker.lorem.paragraphs(),
          en: faker.lorem.paragraphs(),
        },
        image: faker.image.urlPicsumPhotos({ width: 2000, height: 1000 }),
        slug: {
          nl: faker.lorem.slug(),
          en: faker.lorem.slug(),
        },
        author: {
          connect: {
            id: randomItem([kaylee.id, simone.id]),
          },
        },
        categories: {
          connect: getRandomAmountOfCategories(categories),
        },
        published: faker.datatype.boolean(),
        createdAt: creationDate,
        updatedAt: randomItem([creationDate, faker.date.past()]),
      },
    });
  }
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
      filename: 'portal/tools/inclusiviteitsscan.pdf',
      image: 'portal/tools/inclusiviteitsscan.png',
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
      filename: 'portal/tools/inclusievere-projecten-canvas.pdf',
      image: 'portal/tools/inclusievere-projecten-canvas.png',
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

async function createProjects() {
  console.log('Creating projects...');

  const organisations = await prisma.organisation.findMany({
    include: {
      users: true,
    },
  });

  const totalProjects = getRandomNumber();
  console.log(`> Creating ${totalProjects} random projects...`);
  for (let i = 0; i < totalProjects; i++) {
    const organisation = randomItem(organisations);
    await prisma.project.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        organisation: {
          connect: {
            id: organisation.id,
          },
        },
        users: {
          connect: {
            id: organisation.users[0].id,
          },
        },
      },
    });
  }
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomAmountOfCategories(
  categories: Category[]
): CategoryWhereUniqueInput[] {
  return Array.from({
    length: Math.floor(Math.random() * categories.length),
  }).map(() => ({
    id: randomItem(categories).id,
  }));
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

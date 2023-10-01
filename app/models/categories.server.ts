import { type SerializeFrom } from '@remix-run/server-runtime';
import { type Category as DbCategory } from '@prisma/client';
import { prisma } from '~/db.server';

type Category = DbCategory | SerializeFrom<DbCategory>;

export type { Category };

export function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

import { type Prisma, type Tool as DbTool } from '@prisma/client';
import { type SerializeFrom } from '@remix-run/server-runtime';
import { prisma } from '~/db.server';

export type Tool = DbTool | SerializeFrom<DbTool>;

export type ToolWithCategories = Omit<
  Prisma.ToolGetPayload<{
    include: {
      categories: {
        select: {
          id: true;
          name: true;
        };
      };
    };
  }>,
  'createdAt' | 'updatedAt'
>;

export function getTools() {
  return prisma.tool.findMany();
}

export function getToolsWithCategories() {
  return prisma.tool.findMany({
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export function getToolByID(id: string) {
  return prisma.tool.findUniqueOrThrow({
    where: { id },
    include: { categories: true },
  });
}

export function createTool(tool: Tool) {
  return prisma.tool.create({ data: tool });
}

export function updateTool(id: string, tool: Tool) {
  return prisma.tool.update({ where: { id }, data: tool });
}

export function deleteTool(id: string) {
  return prisma.tool.delete({ where: { id } });
}

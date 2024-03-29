import { type Password, type User as DbUser, Role } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/server-runtime';
import bcrypt from 'bcryptjs';

import { prisma } from '~/db.server';

type User = SerializeFrom<DbUser> | DbUser;

export { type User, Role };

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      firstName: '',
      lastName: '',
      locale: 'en',
      role: 'PROJECTLEADER',
      organisation: {},
      password: {
        create: {
          hash: hashedPassword,
          type: 'MUSTCHANGE',
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash']
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return {
    ...userWithoutPassword,
    passwordType: _password.type,
  };
}

export async function updatePassword(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { email },
    data: {
      password: {
        update: {
          hash: hashedPassword,
          type: 'ACTIVE',
        },
      },
    },
  });
}

export async function hasBookmarked(id: User['id'], bookmark: string) {
  const { bookmarks } = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { bookmarks: true },
  });

  return bookmarks.includes(bookmark);
}

export async function updateBookmarks(id: User['id'], bookmark: string) {
  const { bookmarks } = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { bookmarks: true },
  });

  const newBookmarks = bookmarks.includes(bookmark)
    ? bookmarks.filter((b) => b !== bookmark)
    : [...bookmarks, bookmark];

  return prisma.user.update({
    where: { id },
    data: {
      bookmarks: {
        set: newBookmarks,
      },
    },
  });
}

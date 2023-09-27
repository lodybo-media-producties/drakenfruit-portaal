import { type User, type Role } from '~/models/user.server';

const PermissionLevels: Record<Role, number> = {
  MAINTAINER: 500,
  ADMIN: 400,
  OFFICEMANAGER: 300,
  CONSULTANT: 200,
  PROJECTLEADER: 100,
};

export function isAllowedForRole(role: Role, user: User) {
  return PermissionLevels[role] <= PermissionLevels[user.role];
}

export function isStrictlyAllowedForRole(role: Role, user: User) {
  return PermissionLevels[role] === PermissionLevels[user.role];
}

import { Role } from '@prisma/client';

export type Permission =
  | 'workspace.read'
  | 'workspace.update'
  | 'workspace.delete'
  | 'members.read'
  | 'members.invite'
  | 'members.manage'
  | 'inventory.read'
  | 'inventory.create'
  | 'inventory.update'
  | 'inventory.delete'
  | 'inventory.move'
  | 'inventory.export'
  | 'storage.manage'
  | 'audit.read';

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  OWNER: [
    'workspace.read',
    'workspace.update',
    'workspace.delete',
    'members.read',
    'members.invite',
    'members.manage',
    'inventory.read',
    'inventory.create',
    'inventory.update',
    'inventory.delete',
    'inventory.move',
    'inventory.export',
    'storage.manage',
    'audit.read',
  ],
  ADMIN: [
    'workspace.read',
    'workspace.update',
    'members.read',
    'members.invite',
    'members.manage',
    'inventory.read',
    'inventory.create',
    'inventory.update',
    'inventory.delete',
    'inventory.move',
    'inventory.export',
    'storage.manage',
    'audit.read',
  ],
  EDITOR: [
    'workspace.read',
    'members.read',
    'inventory.read',
    'inventory.create',
    'inventory.update',
    'inventory.move',
    'inventory.export',
    'storage.manage',
  ],
  VIEWER: [
    'workspace.read',
    'members.read',
    'inventory.read',
    'inventory.export',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export function roleLevel(role: Role): number {
  switch (role) {
    case Role.OWNER:
      return 4;
    case Role.ADMIN:
      return 3;
    case Role.EDITOR:
      return 2;
    case Role.VIEWER:
      return 1;
    default:
      return 0;
  }
}

import { RoleType } from './role.type';

export type CreateRoleType = Omit<
  RoleType,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

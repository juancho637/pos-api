import { RoleType } from '@modules/roles/domain';

export const roleMock: RoleType = {
  id: 1,
  name: 'admin',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
};

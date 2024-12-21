import { RoleType } from '@modules/roles/domain';

export const roleMock: RoleType = {
  id: 1,
  name: '',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
};

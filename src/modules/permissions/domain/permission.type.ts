import { RoleType } from '@modules/roles/domain';

export type PermissionType = {
  id: number;
  name: string;
  module: string;
  description?: string;
  roles?: RoleType[];
};

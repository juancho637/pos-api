import { PermissionType } from '@modules/permissions/domain';
import { UserType } from '@modules/users/domain';

export type AuthUserType = {
  user: UserType;
  permissions: PermissionType[];
};

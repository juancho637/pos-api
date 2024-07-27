import { UserType } from './user.type';

export type CreateUserType = Partial<UserType> & {
  rolesIds?: number[];
  permissionsIds?: number[];
};

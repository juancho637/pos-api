import { UserType } from './user.type';

export type CreateUserType = Omit<
  UserType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;

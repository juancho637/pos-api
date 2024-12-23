import { CreateUserRepositoryType, UserType } from '@modules/users/domain';
import { usersMock } from './common.mocks';

export const fieldsToCreateUserRepository: CreateUserRepositoryType = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@gmail.com',
  password: 'securepassword',
  status: 'ACTIVE',
};

export const userCreatedMock = {
  id: 1,
  ...fieldsToCreateUserRepository,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const userDeletedMock = {
  ...userCreatedMock,
  deletedAt: new Date(),
};

export const findAndCountUsersMock: [UserType[], number] = [
  usersMock,
  usersMock.length,
];

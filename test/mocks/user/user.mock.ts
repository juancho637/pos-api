import { PaginatedResourceType } from '@common/helpers/domain';
import {
  CreateUserRepositoryType,
  CreateUserType,
  UserType,
} from '@modules/users/domain';

export const userMock: UserType = {
  id: 1,
  name: 'John Doe',
  username: 'john.doe',
  email: 'john.doe@gmail.com',
  password: 'a password',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
};

export const usersMock: UserType[] = [
  userMock,
  {
    id: 2,
    name: 'example',
    username: 'example',
    email: 'example@mail.com',
    password: 'a password',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  },
];

export const paginatedUsersMock: PaginatedResourceType<UserType> = {
  items: usersMock,
  total: usersMock.length,
  currentPage: 1,
  lastPage: 1,
  size: usersMock.length,
};

export const findAndCountUsersMock: [UserType[], number] = [
  usersMock,
  usersMock.length,
];

export const fieldsToCreateUser: CreateUserType = {
  name: 'example',
  username: 'example',
  email: 'example@mail.com',
  password: 'password',
};

export const fieldsToCreateUserRepository: CreateUserRepositoryType = {
  ...fieldsToCreateUser,
  status: 'ACTIVE',
};

export const userCreatedMock: UserType = {
  id: 1,
  ...fieldsToCreateUserRepository,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const userDeletedMock: UserType = {
  ...userCreatedMock,
  deletedAt: new Date(),
};

export const fieldsToUpdateUser = {
  name: 'example',
  email: 'example@mail.com',
};

export const userUpdatedMock: UserType = {
  ...userMock,
  ...fieldsToUpdateUser,
};

import { PaginatedResourceType } from '@common/helpers/domain';
import { UserType } from '@modules/users/domain';
import { UserEntity } from '@modules/users/infrastructure';

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

export const paginatedUsersMock: PaginatedResourceType<Partial<UserType>> = {
  items: usersMock,
  total: usersMock.length,
  current_page: 1,
  last_page: 1,
  size: 10,
};

export const findAndCountUsersMock: [UserType[], number] = [
  usersMock,
  usersMock.length,
];

export const fieldsToCreateUser = {
  name: 'example',
  username: 'example',
  email: 'example@mail.com',
  password: 'password',
};

export const userCreatedMock: UserEntity = {
  id: 1,
  ...fieldsToCreateUser,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
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

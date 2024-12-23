import { UserType, CreateUserType } from '@modules/users/domain';
import { userMock, usersMock } from './common.mocks';

export const fieldsToCreateUser: CreateUserType = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@gmail.com',
  password: 'securepassword',
  rolesIds: [1],
};

export const paginatedUsersMock = {
  items: usersMock,
  total: usersMock.length,
  currentPage: 1,
  lastPage: 1,
  size: usersMock.length,
};

export const fieldsToUpdateUser = {
  name: 'example',
  email: 'example@mail.com',
};

export const userUpdatedMock: UserType = {
  ...userMock,
  ...fieldsToUpdateUser,
};

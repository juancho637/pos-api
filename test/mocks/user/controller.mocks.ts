import { CreateUserDto } from '@modules/users/infrastructure/dto';
import { UserPresenter } from '@modules/users/infrastructure';
import { userMock } from './common.mocks';

export const createUserDtoMock: CreateUserDto = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@gmail.com',
  password: 'securepassword',
  rolesIds: [1],
  permissionsIds: [],
};

export const createUserDtoMockTofailWithoutRolesAndPermissions: CreateUserDto =
  {
    ...createUserDtoMock,
    rolesIds: [],
    permissionsIds: [],
  };

export const createUserDtoMockTofailWithEmptyFields: CreateUserDto = {
  name: '',
  username: '',
  email: '',
  password: '',
  rolesIds: [],
  permissionsIds: [],
};

export const userPresenterMock: UserPresenter = new UserPresenter({
  ...userMock,
});

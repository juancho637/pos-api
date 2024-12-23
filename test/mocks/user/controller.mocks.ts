import { CreateUserDto } from '@modules/users/infrastructure/dto';
import { UserPresenter } from '@modules/users/infrastructure';

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
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@gmail.com',
    password: 'securepassword',
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
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@gmail.com',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
});

import { UserType } from '@modules/users/domain';

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
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@gmail.com',
    password: 'securepassword',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

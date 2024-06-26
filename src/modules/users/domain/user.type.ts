export type UserType = {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

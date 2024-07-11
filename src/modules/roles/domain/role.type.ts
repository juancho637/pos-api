export type RoleType = {
  id: number;
  name: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

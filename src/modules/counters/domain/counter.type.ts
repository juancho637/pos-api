export type CounterType = {
  id: number;
  branch_id: number;
  user_id: number;
  base: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date;
};

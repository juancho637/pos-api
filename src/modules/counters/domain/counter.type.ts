import { OrderType } from '@modules/orders/domain';
import { UserType } from '@modules/users/domain';

export type CounterType = {
  id: number;
  base: number;
  status: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  user: UserType;
  orders?: OrderType[];
};

import { CustomerType } from '@modules/customers/domain';
import { CounterType } from '@modules/counters/domain';
import { OrderTypeEnum } from '../order-type.enum';

export type OrderType = {
  id: number;
  type: OrderTypeEnum;
  subtotalPrice: number;
  fee: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  customer?: CustomerType;
  counter: CounterType;
};

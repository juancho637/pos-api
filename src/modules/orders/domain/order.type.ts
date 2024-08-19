import { CustomerType } from '@modules/customers/domain';
import { CounterType } from '@modules/counters/domain';

export type OrderType = {
  id: number;
  type: string; // TODO: create enum OrderTypeEnum -> 'INVOICE' | 'REMISION'
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

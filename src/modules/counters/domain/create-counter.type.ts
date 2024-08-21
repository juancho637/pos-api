import { CounterType } from './counter.type';

export type CreateCounterType = Omit<
  CounterType,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'user' | 'orders'
> & {
  userId: number;
};

import { CounterType } from './counter.type';

export type CreateCounterType = Omit<
  CounterType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;

import { CounterType } from '../counter.type';

export type CreateCounterRepositoryType = Omit<
  CounterType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

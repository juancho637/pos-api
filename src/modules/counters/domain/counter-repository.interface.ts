import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { CounterType } from './counter.type';
import { CreateCounterType } from './create-counter.type';
import { UpdateCounterType } from './update-counter.type';
import { CounterFilterType } from './counter-filter.type';

export interface ICounterRepository<Entity extends CounterType = CounterType> {
  findOneBy(fields: CounterFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createCounterFields: CreateCounterType): Promise<Entity>;
  update(id: number, updateCounterFields: UpdateCounterType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

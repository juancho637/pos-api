import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { CounterType } from './counter.type';
import { CreateCounterType } from './create-counter.type';
import { UpdateCounterType } from './update-counter.type';
import { CounterFilterType } from './counter-filter.type';

export interface CounterRepositoryInterface<
  Entity extends CounterType = CounterType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<CounterFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<CounterFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createCounterFields: CreateCounterType): Promise<Entity>;
  update(id: number, updateCounterFields: UpdateCounterType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

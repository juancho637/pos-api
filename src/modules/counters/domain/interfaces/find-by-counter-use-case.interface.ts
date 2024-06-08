import { CounterFilterType } from '../counter-filter.type';
import { CounterType } from '../counter.type';

export interface FindByCounterUseCaseInterface<
  Entity extends CounterType = CounterType,
> {
  run(counterFilters: CounterFilterType): Promise<Entity>;
}

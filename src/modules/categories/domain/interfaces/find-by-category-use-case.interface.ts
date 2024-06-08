import { CategoryFilterType } from '../category-filter.type';
import { CategoryType } from '../category.type';

export interface FindByCategoryUseCaseInterface<
  Entity extends CategoryType = CategoryType,
> {
  run(counterFilters: CategoryFilterType): Promise<Entity>;
}

import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { CategoryType } from './category.type';
import { CreateCategoryType } from './create-category.type';
import { UpdateCategoryType } from './update-category.type';
import { CategoryFilterType } from './category-filter.type';

export interface CategoryRepositoryInterface<
  Entity extends CategoryType = CategoryType,
> {
  findOneBy(fields: CategoryFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType<CategoryFilterType>[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(
    createCategoryFields: CreateCategoryType | CreateCategoryType[],
  ): Promise<Entity | Entity[]>;
  update(id: number, updateCategoryFields: UpdateCategoryType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

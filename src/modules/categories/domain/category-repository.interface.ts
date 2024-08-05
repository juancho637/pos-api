import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { CategoryType } from './category.type';
import { CreateCategoryType } from './create-category.type';
import { UpdateCategoryType } from './update-category.type';
import { CategoryFilterType } from './category-filter.type';

export interface CategoryRepositoryInterface<
  Entity extends CategoryType = CategoryType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<CategoryFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<CategoryFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createCategoryFields: CreateCategoryType): Promise<Entity>;
  update(id: number, updateCategoryFields: UpdateCategoryType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

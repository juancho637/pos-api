import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { CategoryType } from './category.type';
import { UpdateCategoryType } from './update-category.type';
import { CategoryFilterType } from './category-filter.type';
import { CreateCategoryRepositoryType } from './create-category-repository.type';

export interface CategoryRepositoryInterface<
  Entity extends CategoryType = CategoryType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<CategoryFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<CategoryFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(
    createCategoryFields:
      | CreateCategoryRepositoryType
      | CreateCategoryRepositoryType[],
  ): Promise<Entity | Entity[]>;
  update(id: number, updateCategoryFields: UpdateCategoryType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

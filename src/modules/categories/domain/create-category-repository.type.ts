import { CategoryType } from './category.type';

export type CreateCategoryRepositoryType = Omit<
  CategoryType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

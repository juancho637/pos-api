import { CategoryType } from './category.type';

export type CreateCategoryType = Omit<
  CategoryType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;

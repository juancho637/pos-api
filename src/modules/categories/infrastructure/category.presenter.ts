import { CategoryType } from '../domain';

export class CategoryPresenter {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  constructor(category: Partial<CategoryType>) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.status = category.status;
    this.created_at = category.createdAt;
    this.updated_at = category.updatedAt;
  }
}

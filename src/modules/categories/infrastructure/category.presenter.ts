import { CategoryType } from '../domain';

export class CategoryPresenter {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(category: Partial<CategoryType>) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.status = category.status;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}

import { CategoryType } from '@modules/categories/domain';

export type ProductFilterType = {
  id?: number;
  name?: string;
  category?: CategoryType;
  fee?: number;
  description?: string;
  type?: string;
  minStock?: number;
  status?: string;
};

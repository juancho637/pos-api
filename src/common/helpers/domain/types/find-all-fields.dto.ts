import { FilteringType } from './filtering.type';
import { PaginationType } from './pagination.type';
import { SortingType } from './sorting.type';

export type FindAllFieldsDto<T> = {
  pagination: PaginationType;
  sort?: SortingType;
  filters?: FilteringType<keyof T | T>[];
};

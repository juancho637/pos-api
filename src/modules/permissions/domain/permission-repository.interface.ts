import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { PermissionType } from './permission.type';
import { PermissionFilterType } from './permission-filter.type';

export interface PermissionRepositoryInterface<
  Entity extends PermissionType = PermissionType,
> {
  findOneBy(fields: PermissionFilterType): Promise<Entity>;
  findByIds(ids: number[]): Promise<Entity[]>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
}

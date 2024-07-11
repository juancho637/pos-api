import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { RoleType } from './role.type';
import { RoleFilterType } from './role-filter.type';
import { CreateRoleType } from './create-role.type';
import { UpdateRoleType } from './update-role.type';

export interface RoleRepositoryInterface<Entity extends RoleType = RoleType> {
  findOneBy(fields: RoleFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createRoleFields: CreateRoleType): Promise<Entity>;
  update(id: number, updateRoleFields: UpdateRoleType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

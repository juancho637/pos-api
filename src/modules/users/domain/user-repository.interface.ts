import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { UserType } from './user.type';
import { CreateUserType } from './create-user.type';
import { UpdateUserType } from './update-user.type';
import { UserFilterType } from './user-filter.type';

export interface UserRepositoryInterface<Entity extends UserType = UserType> {
  findOneBy(fields: UserFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createUserFields: CreateUserType): Promise<Entity>;
  update(id: number, updateUserFields: UpdateUserType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

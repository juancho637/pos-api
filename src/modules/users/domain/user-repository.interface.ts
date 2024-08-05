import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { UserType } from './user.type';
import { CreateUserType } from './create-user.type';
import { UpdateUserType } from './update-user.type';
import { UserFilterType } from './user-filter.type';

export interface UserRepositoryInterface<Entity extends UserType = UserType> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<UserFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<UserFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(
    createUserFields: CreateUserType | CreateUserType[],
  ): Promise<Entity | Entity[]>;
  update(id: number, updateUserFields: UpdateUserType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

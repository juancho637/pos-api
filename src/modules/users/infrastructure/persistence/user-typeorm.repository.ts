import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  PaginatedResourceType,
  FindAllFieldsDto,
  FindOneByFieldsDto,
  FilterRuleEnum,
} from '@common/helpers/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  UserRepositoryInterface,
  UserFilterType,
  UpdateUserType,
  CreateUserType,
  userErrorsCodes,
} from '../../domain';
import { UserEntity } from './user.entity';

export class UserTypeOrmRepository
  implements UserRepositoryInterface<UserEntity>
{
  private readonly context = UserTypeOrmRepository.name;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<UserFilterType>): Promise<UserEntity> {
    try {
      const where = getWhereTypeOrmHelper<UserFilterType>(filter);

      const user = await this.usersRepository.findOne({
        where,
        relations: relations || [],
      });

      return user;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<UserFilterType>): Promise<
    PaginatedResourceType<Partial<UserEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper<UserFilterType>(filters);
      const order = getOrderTypeOrmHelper<UserFilterType>(sort);

      const [users, count] = await this.usersRepository.findAndCount({
        where,
        order,
        skip: (page - 1) * size,
        take: size,
      });

      const lastPage = Math.ceil(count / size);

      return {
        total: count,
        current_page: page,
        last_page: lastPage,
        size,
        items: users,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createUserFields: CreateUserType | CreateUserType[],
  ): Promise<UserEntity | UserEntity[]> {
    try {
      if (Array.isArray(createUserFields)) {
        return this.usersRepository.save(createUserFields);
      }

      return this.usersRepository.save(createUserFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateUserFields: UpdateUserType,
  ): Promise<UserEntity> {
    try {
      const user = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.usersRepository.save({ ...user, ...updateUserFields });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<UserEntity> {
    try {
      const user = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      await this.usersRepository.softRemove(user);

      return { ...user, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM050,
        context: this.context,
        error,
      });
    }
  }
}

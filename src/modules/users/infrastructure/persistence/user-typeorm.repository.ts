import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
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

  async findOneBy(
    fields: UserFilterType,
    relations?: string[],
  ): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOne({
        where: { ...fields },
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

  async findAll(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<UserEntity>>> {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

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

  async store(createUserFields: CreateUserType): Promise<UserEntity> {
    try {
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
      const user = await this.findOneBy({ id });

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
      const user = await this.findOneBy({ id });

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

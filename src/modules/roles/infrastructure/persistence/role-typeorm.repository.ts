import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  FilterRuleEnum,
  FindAllFieldsDto,
  FindOneByFieldsDto,
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
  RoleRepositoryInterface,
  RoleFilterType,
  roleErrorsCodes,
  CreateRoleType,
  UpdateRoleType,
} from '../../domain';
import { RoleEntity } from './role.entity';

export class RoleTypeOrmRepository
  implements RoleRepositoryInterface<RoleEntity>
{
  private readonly context = RoleTypeOrmRepository.name;

  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<RoleFilterType>): Promise<RoleEntity> {
    try {
      const where = getWhereTypeOrmHelper<RoleFilterType>(filter);

      const role = await this.rolesRepository.findOneOrFail({
        where,
        relations: relations || [],
      });

      return role;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: roleErrorsCodes.ROL010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<RoleFilterType>): Promise<
    PaginatedResourceType<RoleEntity>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [roles, count] = await this.rolesRepository.findAndCount({
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
        items: roles,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: roleErrorsCodes.ROL020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createRoleFields: CreateRoleType | CreateRoleType[],
  ): Promise<RoleEntity | RoleEntity[]> {
    try {
      if (Array.isArray(createRoleFields)) {
        return this.rolesRepository.save(createRoleFields);
      }

      return this.rolesRepository.save(createRoleFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: roleErrorsCodes.ROL030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateRoleFields: UpdateRoleType,
  ): Promise<RoleEntity> {
    try {
      const role = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.rolesRepository.save({ ...role, ...updateRoleFields });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: roleErrorsCodes.ROL040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<RoleEntity> {
    try {
      const role = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.rolesRepository.save({
        ...role,
        status: 'INACTIVE',
        deletedAt: new Date(),
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: roleErrorsCodes.ROL050,
        context: this.context,
        error,
      });
    }
  }
}

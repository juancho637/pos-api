import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
  PermissionRepositoryInterface,
  PermissionFilterType,
  permissionErrorsCodes,
} from '../../domain';
import { PermissionEntity } from './permission.entity';

export class PermissionTypeOrmRepository
  implements PermissionRepositoryInterface<PermissionEntity>
{
  private readonly context = PermissionTypeOrmRepository.name;

  constructor(
    @InjectRepository(PermissionEntity)
    private readonly PermissionsRepository: Repository<PermissionEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy(fields: PermissionFilterType): Promise<PermissionEntity> {
    try {
      const Permission = await this.PermissionsRepository.findOneOrFail({
        where: { ...fields },
      });

      return Permission;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: permissionErrorsCodes.PRM010,
        context: this.context,
        error,
      });
    }
  }

  async findByIds(ids: number[]): Promise<PermissionEntity[]> {
    try {
      const Permission = await this.PermissionsRepository.find({
        where: { id: In(ids) },
      });

      return Permission;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: permissionErrorsCodes.PRM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<PermissionEntity>>> {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [Permissions, count] =
        await this.PermissionsRepository.findAndCount({
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
        items: Permissions,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: permissionErrorsCodes.PRM020,
        context: this.context,
        error,
      });
    }
  }
}

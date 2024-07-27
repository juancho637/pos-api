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
  ProviderRepositoryInterface,
  ProviderFilterType,
  UpdateProviderType,
  CreateProviderType,
  providerErrorsCodes,
} from '../../domain';
import { ProviderEntity } from './provider.entity';

export class ProviderTypeOrmRepository
  implements ProviderRepositoryInterface<ProviderEntity>
{
  private readonly context = ProviderTypeOrmRepository.name;

  constructor(
    @InjectRepository(ProviderEntity)
    private readonly providersRepository: Repository<ProviderEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy(fields: ProviderFilterType): Promise<ProviderEntity> {
    try {
      const provider = await this.providersRepository.findOneOrFail({
        where: { ...fields },
      });

      return provider;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType<ProviderFilterType>[],
  ): Promise<PaginatedResourceType<Partial<ProviderEntity>>> {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [providers, count] = await this.providersRepository.findAndCount({
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
        items: providers,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createProviderFields: CreateProviderType,
  ): Promise<ProviderEntity> {
    try {
      return this.providersRepository.save(createProviderFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateProviderFields: UpdateProviderType,
  ): Promise<ProviderEntity> {
    try {
      const provider = await this.findOneBy({ id });

      return await this.providersRepository.save({
        ...provider,
        ...updateProviderFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<ProviderEntity> {
    try {
      const provider = await this.findOneBy({ id });

      await this.providersRepository.softRemove(provider);

      return { ...provider, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM050,
        context: this.context,
        error,
      });
    }
  }
}

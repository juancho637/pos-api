import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  PaginatedResourceType,
  FindOneByFieldsDto,
  FindAllFieldsDto,
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
  CounterRepositoryInterface,
  CounterFilterType,
  UpdateCounterType,
  counterErrorsCodes,
  CreateCounterRepositoryType,
} from '../../domain';
import { CounterEntity } from './counter.entity';

export class CounterTypeOrmRepository
  implements CounterRepositoryInterface<CounterEntity>
{
  private readonly context = CounterTypeOrmRepository.name;

  constructor(
    @InjectRepository(CounterEntity)
    private readonly countersRepository: Repository<CounterEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<CounterFilterType>): Promise<CounterEntity> {
    try {
      const where = getWhereTypeOrmHelper<CounterFilterType>(filter);

      const counter = await this.countersRepository.findOneOrFail({
        where,
        relations: relations || [],
      });

      return counter;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<CounterFilterType>): Promise<
    PaginatedResourceType<Partial<CounterEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [counters, count] = await this.countersRepository.findAndCount({
        where,
        order,
        skip: (page - 1) * size,
        take: size,
      });

      const lastPage = Math.ceil(count / size);

      return {
        total: count,
        currentPage: page,
        lastPage: lastPage,
        size,
        items: counters,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createCounterFields:
      | CreateCounterRepositoryType
      | CreateCounterRepositoryType[],
  ): Promise<CounterEntity | CounterEntity[]> {
    try {
      if (Array.isArray(createCounterFields)) {
        return this.countersRepository.save(createCounterFields);
      }

      return this.countersRepository.save(createCounterFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateCounterFields: UpdateCounterType,
  ): Promise<CounterEntity> {
    try {
      const counter = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.countersRepository.save({
        ...counter,
        ...updateCounterFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<CounterEntity> {
    try {
      const counter = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      await this.countersRepository.softRemove(counter);

      return { ...counter, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM050,
        context: this.context,
        error,
      });
    }
  }
}

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
  CustomerRepositoryInterface,
  CustomerFilterType,
  UpdateCustomerType,
  customerErrorsCodes,
  CreateCustomerRepositoryType,
} from '../../domain';
import { CustomerEntity } from './customer.entity';

export class CustomerTypeOrmRepository
  implements CustomerRepositoryInterface<CustomerEntity>
{
  private readonly context = CustomerTypeOrmRepository.name;

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customersRepository: Repository<CustomerEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<CustomerFilterType>): Promise<CustomerEntity> {
    try {
      const where = getWhereTypeOrmHelper<CustomerFilterType>(filter);

      const customer = await this.customersRepository.findOneOrFail({
        where,
        relations: relations || [],
      });

      return customer;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<CustomerFilterType>): Promise<
    PaginatedResourceType<Partial<CustomerEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [customers, count] = await this.customersRepository.findAndCount({
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
        items: customers,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createCustomerFields: CreateCustomerRepositoryType,
  ): Promise<CustomerEntity> {
    try {
      return this.customersRepository.save(createCustomerFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateCustomerFields: UpdateCustomerType,
  ): Promise<CustomerEntity> {
    try {
      const customer = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.customersRepository.save({
        ...customer,
        ...updateCustomerFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<CustomerEntity> {
    try {
      const customer = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      await this.customersRepository.softRemove(customer);

      return { ...customer, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM050,
        context: this.context,
        error,
      });
    }
  }
}

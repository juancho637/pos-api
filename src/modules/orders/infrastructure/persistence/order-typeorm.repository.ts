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
  OrderRepositoryInterface,
  OrderFilterType,
  orderErrorsCodes,
  UpdateOrderType,
} from '../../domain';
import { OrderEntity } from './order.entity';
import { CreateOrderRepositoryType } from '@modules/orders/domain/types';

export class OrderTypeOrmRepository
  implements OrderRepositoryInterface<OrderEntity>
{
  private readonly context = OrderTypeOrmRepository.name;

  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<OrderFilterType>): Promise<OrderEntity> {
    try {
      const where = getWhereTypeOrmHelper<OrderFilterType>(filter);

      const order = await this.ordersRepository.findOneOrFail({
        where,
        relations: relations || [],
      });

      return order;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<OrderFilterType>): Promise<
    PaginatedResourceType<OrderEntity>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [orders, count] = await this.ordersRepository.findAndCount({
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
        items: orders,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createOrderFields: CreateOrderRepositoryType | CreateOrderRepositoryType[],
  ): Promise<OrderEntity | OrderEntity[]> {
    try {
      if (Array.isArray(createOrderFields)) {
        return this.ordersRepository.save(createOrderFields);
      }

      return this.ordersRepository.save(createOrderFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateOrderFields: UpdateOrderType,
  ): Promise<OrderEntity> {
    try {
      const order = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.ordersRepository.save({
        ...order,
        ...updateOrderFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<OrderEntity> {
    try {
      const order = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.ordersRepository.save({
        ...order,
        status: 'INACTIVE',
        deletedAt: new Date(),
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD050,
        context: this.context,
        error,
      });
    }
  }
}

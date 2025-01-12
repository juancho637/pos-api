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
  OrderDetailRepositoryInterface,
  OrderDetailFilterType,
  UpdateOrderDetailType,
  orderDetailErrorsCodes,
  CreateOrderDetailRepositoryType,
} from '../../domain';
import { OrderDetailEntity } from './order-detail.entity';

export class OrderDetailTypeOrmRepository
  implements OrderDetailRepositoryInterface<OrderDetailEntity>
{
  private readonly context = OrderDetailTypeOrmRepository.name;

  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailsRepository: Repository<OrderDetailEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<OrderDetailFilterType>): Promise<OrderDetailEntity> {
    try {
      const where = getWhereTypeOrmHelper<OrderDetailFilterType>(filter);

      const orderDetail = await this.orderDetailsRepository.findOneOrFail({
        where,
        relations: relations || [],
      });

      return orderDetail;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<OrderDetailFilterType>): Promise<
    PaginatedResourceType<Partial<OrderDetailEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [orderDetails, count] =
        await this.orderDetailsRepository.findAndCount({
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
        items: orderDetails,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createOrderDetailFields:
      | CreateOrderDetailRepositoryType
      | CreateOrderDetailRepositoryType[],
  ): Promise<OrderDetailEntity | OrderDetailEntity[]> {
    try {
      if (Array.isArray(createOrderDetailFields)) {
        return this.orderDetailsRepository.save(createOrderDetailFields);
      }

      return this.orderDetailsRepository.save(createOrderDetailFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateOrderDetailFields: UpdateOrderDetailType,
  ): Promise<OrderDetailEntity> {
    try {
      const orderDetail = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.orderDetailsRepository.save({
        ...orderDetail,
        ...updateOrderDetailFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<OrderDetailEntity> {
    try {
      const orderDetail = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      await this.orderDetailsRepository.softRemove(orderDetail);

      return { ...orderDetail, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM050,
        context: this.context,
        error,
      });
    }
  }
}

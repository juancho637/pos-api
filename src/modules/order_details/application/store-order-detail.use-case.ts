import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { FilterRuleEnum } from '@common/helpers/domain';

import {
  CreateOrderDetailType,
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';
import { FindByOrderUseCase } from '@modules/orders/application';
import { FindByProductStockUseCase } from '@modules/product-stocks/application';

export class StoreOrderDetailUseCase {
  private readonly context = StoreOrderDetailUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly findByProductStockUseCase: FindByProductStockUseCase,
    private readonly findByOrderUseCase: FindByOrderUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    createOrderDetail: CreateOrderDetailType,
  ): Promise<OrderDetailType> {
    try {
      const { productStockId, orderId, ...createOrderDetailFields } =
        createOrderDetail;

      const productStock = await this.findByProductStockUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: productStockId,
        },
      });

      const order = await this.findByOrderUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: orderId,
        },
      });

      const orderDetail = await this.orderDetailRepository.store({
        productStock,
        order,
        ...createOrderDetailFields,
        status: 'ACTIVE',
      });

      return orderDetail as OrderDetailType;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM031,
        context: this.context,
        error,
      });
    }
  }
}

import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { FilterRuleEnum } from '@common/helpers/domain';
import {
  UpdateOrderDetailType,
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';
import { FindByProductStockUseCase } from '@modules/product-stocks/application';
import { FindByOrderUseCase } from '@modules/orders/application';

export class UpdateOrderDetailUseCase {
  private readonly context = UpdateOrderDetailUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly findByProductStockUseCase: FindByProductStockUseCase,
    private readonly findByOrderUseCase: FindByOrderUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    {
      productStockId,
      orderId,
      ...updateOrderDetailFields
    }: UpdateOrderDetailType,
  ): Promise<OrderDetailType> {
    try {
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

      const orderDetail = await this.orderDetailRepository.update(id, {
        productStock,
        order,
        ...updateOrderDetailFields,
      });

      return orderDetail;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM041,
        context: this.context,
        error,
      });
    }
  }
}

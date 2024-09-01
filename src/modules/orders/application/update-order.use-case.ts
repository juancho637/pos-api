import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateOrderType,
  OrderRepositoryInterface,
  OrderType,
  orderErrorsCodes,
} from '../domain';

export class UpdateOrderUseCase {
  private readonly context = UpdateOrderUseCase.name;

  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    updateOrderFields: UpdateOrderType,
  ): Promise<OrderType> {
    try {
      const order = await this.orderRepository.update(id, updateOrderFields);

      return order;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD041,
        context: this.context,
        error,
      });
    }
  }
}

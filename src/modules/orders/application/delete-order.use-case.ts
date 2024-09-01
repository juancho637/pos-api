import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  OrderRepositoryInterface,
  OrderType,
  orderErrorsCodes,
} from '../domain';

export class DeleteOrderUseCase {
  private readonly context = DeleteOrderUseCase.name;

  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<OrderType> {
    try {
      const order = await this.orderRepository.delete(id);

      return order;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD051,
        context: this.context,
        error,
      });
    }
  }
}

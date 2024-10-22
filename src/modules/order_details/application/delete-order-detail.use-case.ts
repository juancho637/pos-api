import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';

export class DeleteOrderDetailUseCase {
  private readonly context = DeleteOrderDetailUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<OrderDetailType> {
    try {
      const orderDetail = await this.orderDetailRepository.delete(id);

      return orderDetail;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.CNTM051,
        context: this.context,
        error,
      });
    }
  }
}

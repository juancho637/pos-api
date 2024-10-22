import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateOrderDetailType,
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';

export class UpdateOrderDetailUseCase {
  private readonly context = UpdateOrderDetailUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    updateOrderDetailFields: UpdateOrderDetailType,
  ): Promise<OrderDetailType> {
    try {
      const orderDetail = await this.orderDetailRepository.update(
        id,
        updateOrderDetailFields,
      );

      return orderDetail;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.CNTM041,
        context: this.context,
        error,
      });
    }
  }
}

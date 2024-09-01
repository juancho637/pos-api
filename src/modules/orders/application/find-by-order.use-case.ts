import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  OrderFilterType,
  OrderRepositoryInterface,
  OrderType,
  orderErrorsCodes,
} from '../domain';
import { FindOneByFieldsDto } from '@common/helpers/domain';

export class FindByOrderUseCase {
  private readonly context = FindByOrderUseCase.name;

  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    filter,
    relations,
  }: FindOneByFieldsDto<OrderFilterType>): Promise<OrderType> {
    try {
      const order = await this.orderRepository.findOneBy({
        filter,
        relations,
      });

      return order;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD011,
        context: this.context,
        error,
      });
    }
  }
}

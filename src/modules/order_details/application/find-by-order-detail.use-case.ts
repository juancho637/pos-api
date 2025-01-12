import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  OrderDetailFilterType,
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';
import { FindOneByFieldsDto } from '@common/helpers/domain';

export class FindByOrderDetailUseCase {
  private readonly context = FindByOrderDetailUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    filter,
    relations,
  }: FindOneByFieldsDto<OrderDetailFilterType>): Promise<OrderDetailType> {
    try {
      const orderDetail = await this.orderDetailRepository.findOneBy({
        filter,
        relations,
      });

      return orderDetail;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM011,
        context: this.context,
        error,
      });
    }
  }
}

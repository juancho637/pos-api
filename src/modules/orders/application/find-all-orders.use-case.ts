import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  OrderFilterType,
  OrderRepositoryInterface,
  OrderType,
  orderErrorsCodes,
} from '../domain';

export class FindAllOrdersUseCase {
  private readonly context = FindAllOrdersUseCase.name;

  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<OrderFilterType>): Promise<
    PaginatedResourceType<OrderType>
  > {
    try {
      const orderResource = await this.orderRepository.findAll({
        pagination,
        sort,
        filters,
      });

      return orderResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD021,
        context: this.context,
        error,
      });
    }
  }
}

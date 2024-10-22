import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  OrderDetailFilterType,
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';

export class FindAllOrderDetailsUseCase {
  private readonly context = FindAllOrderDetailsUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    pagination,
    sort,
    filters,
    relations,
  }: FindAllFieldsDto<OrderDetailFilterType>): Promise<
    PaginatedResourceType<Partial<OrderDetailType>>
  > {
    try {
      const orderDetailResource = await this.orderDetailRepository.findAll({
        pagination,
        sort,
        filters,
        relations,
      });

      return orderDetailResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.CNTM021,
        context: this.context,
        error,
      });
    }
  }
}

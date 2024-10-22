import { Controller, Get, Inject } from '@nestjs/common';
import {
  PaginationType,
  SortingType,
  PaginatedResourceType,
  FilteringType,
} from '@common/helpers/domain';
import {
  PaginationParams,
  FilteringParams,
  SortingParams,
} from '@common/helpers/infrastructure';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  OrderDetailFilterType,
  OrderDetailProvidersEnum,
  orderDetailErrorsCodes,
} from '../../domain';
import { FindAllOrderDetailsUseCase } from '../../application';
import { OrderDetailPresenter } from '../order-detail.presenter';

@Controller()
export class FindAllOrderDetailsController {
  private readonly context = FindAllOrderDetailsController.name;

  constructor(
    @Inject(OrderDetailProvidersEnum.FIND_ALL_ORDER_DETAILS_USE_CASE)
    private readonly findAllOrderDetailsUseCase: FindAllOrderDetailsUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/orderDetails')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams<OrderDetailFilterType>('id', 'productStockId', 'orderId')
    sortParams?: SortingType<OrderDetailFilterType>,
    @FilteringParams('id', 'product_id', 'provider_id')
    filterParams?: FilteringType<OrderDetailFilterType>[],
  ): Promise<PaginatedResourceType<OrderDetailPresenter>> {
    try {
      const orderDetails = await this.findAllOrderDetailsUseCase.run({
        pagination: paginationParams,
        sort: sortParams,
        filters: filterParams,
      });

      return {
        ...orderDetails,
        items: orderDetails.items.map(
          (orderDetail) => new OrderDetailPresenter(orderDetail),
        ),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM022,
        context: this.context,
        error,
      });
    }
  }
}

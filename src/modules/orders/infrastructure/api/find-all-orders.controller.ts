import { Controller, Get, Inject } from '@nestjs/common';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
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
import { Auth } from '@modules/auth/infrastructure';
import {
  OrderFilterType,
  OrderPermissionsEnum,
  OrderProvidersEnum,
  orderErrorsCodes,
} from '../../domain';
import { FindAllOrdersUseCase } from '../../application';
import { OrderPresenter } from '../order.presenter';

@Controller()
export class FindAllOrdersController {
  private readonly context = FindAllOrdersController.name;

  constructor(
    @Inject(OrderProvidersEnum.FIND_ALL_ORDERS_USE_CASE)
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/orders')
  @Auth<OrderPermissionsEnum>(OrderPermissionsEnum.LIST_ORDER)
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams<OrderFilterType>('id', 'type', 'status', 'totalPrice')
    sortParams?: SortingType<OrderFilterType>,
    @FilteringParams<OrderFilterType>('id', 'type', 'status', 'totalPrice')
    filterParams?: FilteringType<OrderFilterType>[],
  ): Promise<PaginatedResourceType<OrderPresenter>> {
    try {
      const orders = await this.findAllOrdersUseCase.run({
        pagination: paginationParams,
        sort: sortParams,
        filters: filterParams,
      });

      return {
        ...orders,
        items: orders.items.map((order) => new OrderPresenter(order)),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD022,
        context: this.context,
        error,
      });
    }
  }
}

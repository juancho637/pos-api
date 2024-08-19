import { Body, Controller, Inject, Post } from '@nestjs/common';
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
  OrderPermissionsEnum,
  OrderProvidersEnum,
  orderErrorsCodes,
} from '../../domain';
import { StoreOrderUseCase } from '../../application';
import { CreateOrderDto } from './dto';
import { OrderPresenter } from '../order.presenter';

@Controller()
export class StoreOrderController {
  private readonly context = StoreOrderController.name;

  constructor(
    @Inject(OrderProvidersEnum.STORE_ORDER_USE_CASE)
    private readonly storeOrderUseCase: StoreOrderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/orders')
  @Auth<OrderPermissionsEnum>(OrderPermissionsEnum.CREATE_ORDER)
  async run(@Body() createOrderDto: CreateOrderDto): Promise<OrderPresenter> {
    try {
      const order = await this.storeOrderUseCase.run(createOrderDto);

      return new OrderPresenter(order);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD032,
        context: this.context,
        error,
      });
    }
  }
}

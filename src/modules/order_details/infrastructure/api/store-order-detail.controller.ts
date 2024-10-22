import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { OrderDetailProvidersEnum, orderDetailErrorsCodes } from '../../domain';
import { StoreOrderDetailUseCase } from '../../application';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderDetailPresenter } from '../order-detail.presenter';

@Controller()
export class StoreOrderDetailController {
  private readonly context = StoreOrderDetailController.name;

  constructor(
    @Inject(OrderDetailProvidersEnum.STORE_ORDER_DETAIL_USE_CASE)
    private readonly storeOrderDetailUseCase: StoreOrderDetailUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/orderDetails')
  async run(
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ): Promise<OrderDetailPresenter> {
    try {
      const orderDetail =
        await this.storeOrderDetailUseCase.run(createOrderDetailDto);
      return new OrderDetailPresenter(orderDetail);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM032,
        context: this.context,
        error,
      });
    }
  }
}

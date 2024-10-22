import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { OrderDetailProvidersEnum, orderDetailErrorsCodes } from '../../domain';
import { DeleteOrderDetailUseCase } from '../../application';
import { OrderDetailPresenter } from '../order-detail.presenter';

@Controller()
export class DeleteOrderDetailController {
  private readonly context = DeleteOrderDetailController.name;

  constructor(
    @Inject(OrderDetailProvidersEnum.DELETE_ORDER_DETAIL_USE_CASE)
    private readonly deleteOrderDetailUseCase: DeleteOrderDetailUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/orderDetails/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderDetailPresenter> {
    try {
      const orderDetail = await this.deleteOrderDetailUseCase.run(id);

      return new OrderDetailPresenter(orderDetail);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM052,
        context: this.context,
        error,
      });
    }
  }
}

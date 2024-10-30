import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Put,
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
import { UpdateOrderDetailUseCase } from '../../application';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetailPresenter } from '../order-detail.presenter';

@Controller()
export class UpdateOrderDetailController {
  private readonly context = UpdateOrderDetailController.name;

  constructor(
    @Inject(OrderDetailProvidersEnum.UPDATE_ORDER_DETAIL_USE_CASE)
    private readonly updateOrderDetailUseCase: UpdateOrderDetailUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/order-details/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<OrderDetailPresenter> {
    try {
      const orderDetail = await this.updateOrderDetailUseCase.run(
        id,
        updateOrderDetailDto,
      );

      return new OrderDetailPresenter(orderDetail);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM042,
        context: this.context,
        error,
      });
    }
  }
}

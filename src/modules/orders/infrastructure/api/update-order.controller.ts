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
import { Auth } from '@modules/auth/infrastructure';
import {
  OrderPermissionsEnum,
  OrderProvidersEnum,
  orderErrorsCodes,
} from '../../domain';
import { UpdateOrderUseCase } from '../../application';
import { UpdateOrderDto } from './dto';
import { OrderPresenter } from '../order.presenter';

@Controller()
export class UpdateOrderController {
  private readonly context = UpdateOrderController.name;

  constructor(
    @Inject(OrderProvidersEnum.UPDATE_ORDER_USE_CASE)
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/orders/:id')
  @Auth<OrderPermissionsEnum>(OrderPermissionsEnum.UPDATE_ORDER)
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderPresenter> {
    try {
      const order = await this.updateOrderUseCase.run(id, updateOrderDto);

      return new OrderPresenter(order);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD042,
        context: this.context,
        error,
      });
    }
  }
}

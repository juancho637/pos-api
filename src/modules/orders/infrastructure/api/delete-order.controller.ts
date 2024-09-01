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
import { Auth } from '@modules/auth/infrastructure';
import {
  OrderPermissionsEnum,
  OrderProvidersEnum,
  orderErrorsCodes,
} from '../../domain';
import { DeleteOrderUseCase } from '../../application';
import { OrderPresenter } from '../order.presenter';

@Controller()
export class DeleteOrderController {
  private readonly context = DeleteOrderController.name;

  constructor(
    @Inject(OrderProvidersEnum.DELETE_ORDER_USE_CASE)
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/orders/:id')
  @Auth<OrderPermissionsEnum>(OrderPermissionsEnum.DELETE_ORDER)
  async run(@Param('id', ParseIntPipe) id: number): Promise<OrderPresenter> {
    try {
      const order = await this.deleteOrderUseCase.run(id);

      return new OrderPresenter(order);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD052,
        context: this.context,
        error,
      });
    }
  }
}

import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { FilterRuleEnum } from '@common/helpers/domain';
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
import { FindByOrderUseCase } from '../../application';
import { OrderPresenter } from '../order.presenter';

@Controller()
export class FindByOrderController {
  private readonly context = FindByOrderController.name;

  constructor(
    @Inject(OrderProvidersEnum.FIND_BY_ORDER_USE_CASE)
    private readonly findByOrderUseCase: FindByOrderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/orders/:id')
  @Auth<OrderPermissionsEnum>(OrderPermissionsEnum.READ_ORDER)
  async run(@Param('id', ParseIntPipe) id: number): Promise<OrderPresenter> {
    try {
      const order = await this.findByOrderUseCase.run({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return new OrderPresenter(order);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD012,
        context: this.context,
        error,
      });
    }
  }
}

import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { OrderDetailProvidersEnum, orderDetailErrorsCodes } from '../../domain';
import { FindByOrderDetailUseCase } from '../../application';
import { OrderDetailPresenter } from '../order-detail.presenter';
import { FilterRuleEnum } from '@common/helpers/domain';

@Controller()
export class FindByOrderDetailController {
  private readonly context = FindByOrderDetailController.name;

  constructor(
    @Inject(OrderDetailProvidersEnum.FIND_BY_ORDER_DETAIL_USE_CASE)
    private readonly findByOrderDetailUseCase: FindByOrderDetailUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/order-details/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderDetailPresenter> {
    try {
      const orderDetail = await this.findByOrderDetailUseCase.run({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return new OrderDetailPresenter({
        ...orderDetail,
      });
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.ODTM012,
        context: this.context,
        error,
      });
    }
  }
}

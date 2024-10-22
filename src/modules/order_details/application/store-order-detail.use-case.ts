import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { FilterRuleEnum } from '@common/helpers/domain';
import { FindByUserUseCase } from '@modules/users/application';
import {
  CreateOrderDetailType,
  OrderDetailRepositoryInterface,
  OrderDetailType,
  orderDetailErrorsCodes,
} from '../domain';

export class StoreOrderDetailUseCase {
  private readonly context = StoreOrderDetailUseCase.name;

  constructor(
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly findByUserUseCase: FindByUserUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    createOrderDetail: CreateOrderDetailType,
  ): Promise<OrderDetailType> {
    try {
      const { userId, ...createOrderDetailFields } = createOrderDetail;

      const user = await this.findByUserUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: userId,
        },
      });

      const orderDetail = await this.orderDetailRepository.store({
        ...createOrderDetailFields,
        user,
        status: 'ACTIVE',
      });

      return orderDetail as OrderDetailType;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderDetailErrorsCodes.CNTM031,
        context: this.context,
        error,
      });
    }
  }
}

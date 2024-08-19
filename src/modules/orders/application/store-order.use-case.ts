import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { FilterRuleEnum } from '@common/helpers/domain';
import { FindByCounterUseCase } from '@modules/counters/application';
import { FindByCustomerUseCase } from '@modules/customers/application';
import {
  CreateOrderType,
  OrderRepositoryInterface,
  OrderType,
  orderErrorsCodes,
} from '../domain';

export class StoreOrderUseCase {
  private readonly context = StoreOrderUseCase.name;

  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly findByCounterUseCase: FindByCounterUseCase,
    private readonly findByCustomerUseCase: FindByCustomerUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(createOrder: CreateOrderType): Promise<OrderType> {
    try {
      const { counterId, customerId, ...createOrderFields } = createOrder;

      const counter = await this.findByCounterUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: counterId,
        },
      });

      const customer =
        customerId &&
        (await this.findByCustomerUseCase.run({
          filter: {
            property: 'id',
            rule: FilterRuleEnum.EQUALS,
            value: counterId,
          },
        }));

      const order = await this.orderRepository.store({
        ...createOrderFields,
        counter,
        customer,
        status: 'ACTIVE',
      });

      return order as OrderType;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: orderErrorsCodes.ORD031,
        context: this.context,
        error,
      });
    }
  }
}

import { faker } from '@faker-js/faker';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import {
  OrderRepositoryInterface,
  OrderType,
  CreateOrderRepositoryType,
  OrderTypeEnum,
} from '../../domain';
import { CounterType } from '@modules/counters/domain';
import { CustomerType } from '@modules/customers/domain';

export class DevOrdersSeeder {
  private readonly context = DevOrdersSeeder.name;

  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(
    counters: CounterType[],
    customers: CustomerType[],
  ): Promise<OrderType[]> {
    const ordersFields: CreateOrderRepositoryType[] = [];

    counters.forEach((counter) => {
      for (let i = 0; i < 5; i++) {
        const customer = faker.helpers.arrayElement([null, ...customers]);

        const subtotalPrice = faker.number.int({ min: 10000, max: 50000 });
        const fee = subtotalPrice * 0.19;
        const totalPrice = subtotalPrice + fee;

        ordersFields.push({
          type: faker.helpers.arrayElement([
            OrderTypeEnum.INVOICE,
            OrderTypeEnum.REMISION,
          ]) as OrderTypeEnum,
          subtotalPrice: subtotalPrice,
          fee: fee,
          totalPrice: totalPrice,
          status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
          customer: customer || undefined,
          counter: counter,
        });
      }
    });

    const orders = await this.orderRepository.store(ordersFields);

    this.logger.debug({
      message: 'Development orders seeded',
      context: this.context,
    });

    return orders as OrderType[];
  }
}

import { faker } from '@faker-js/faker';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { UserType } from '@modules/users/domain';
import {
  CounterRepositoryInterface,
  CounterType,
  CreateCounterRepositoryType,
} from '../../domain';

export class DevCountersSeeder {
  private readonly context = DevCountersSeeder.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(users: UserType[]): Promise<CounterType[]> {
    const countersFields: CreateCounterRepositoryType[] = [];

    const sellers = users.filter((user) =>
      user.roles.some((role) => role.name === 'seller'),
    );

    sellers.map((seller) => {
      const pastDate = faker.date.past();
      const startTime = new Date(pastDate.setHours(8, 0, 0, 0));
      const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000);

      countersFields.push({
        user: seller,
        base: faker.number.int({ min: 200000, max: 500000 }),
        startTime,
        endTime,
        status: 'ACTIVE',
      });
    });

    const counters = await this.counterRepository.store(countersFields);

    this.logger.debug({
      message: 'Development counters seeded',
      context: this.context,
    });

    return counters as CounterType[];
  }
}

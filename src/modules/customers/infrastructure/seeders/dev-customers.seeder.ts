import { faker } from '@faker-js/faker';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import {
  CreateCustomerRepositoryType,
  CustomerRepositoryInterface,
  CustomerType,
} from '../../domain';

export class DevCustomersSeeder {
  private readonly context = DevCustomersSeeder.name;

  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(): Promise<CustomerType[]> {
    const customersFields: CreateCustomerRepositoryType[] = [];

    for (let i = 0; i < 10; i++) {
      const personInfo = faker.person;
      const internetInfo = faker.internet;

      customersFields.push({
        typeIdentification: 'CC',
        identification: faker.number
          .int({ min: 1000000000, max: 9999999999 })
          .toString(),
        fullName: personInfo.fullName(),
        email: internetInfo.email(),
        cellPhone: faker.phone.number(),
        status: 'ACTIVE',
      });
    }

    const customers = await this.customerRepository.store(customersFields);

    this.logger.debug({
      message: 'Development customers seeded',
      context: this.context,
    });

    return customers as CustomerType[];
  }
}

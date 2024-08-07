import { faker } from '@faker-js/faker';
import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import {
  CreateUserType,
  UserRepositoryInterface,
  UserType,
} from '../../domain';
import { RoleType } from '@modules/roles/domain';

export class DevUsersSeeder {
  private readonly context = DevUsersSeeder.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(roles: RoleType[]): Promise<UserType[]> {
    const usersFields: CreateUserType[] = [];
    const password = await this.hashService.hash('password');

    usersFields.push({
      name: 'Juan David Garcia',
      username: 'juancho',
      password: password,
      status: 'ACTIVE',
      roles: roles.filter((role) => role.name === 'admin'),
    });

    for (let i = 0; i < 10; i++) {
      const personInfo = faker.person;
      const internetInfo = faker.internet;

      usersFields.push({
        name: personInfo.fullName(),
        username: internetInfo.userName(),
        email: internetInfo.email(),
        password: password,
        status: 'ACTIVE',
        roles: [faker.helpers.arrayElement(roles)],
      });
    }

    const users = await this.userRepository.store(usersFields);

    this.logger.debug({
      message: 'Development users seeded',
      context: this.context,
    });

    return users as UserType[];
  }
}

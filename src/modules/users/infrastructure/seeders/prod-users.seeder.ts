import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import {
  CreateUserType,
  UserRepositoryInterface,
  UserType,
} from '../../domain';
import { RoleType } from '@modules/roles/domain';

export class ProdUsersSeeder {
  private readonly context = ProdUsersSeeder.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(roles: RoleType[]): Promise<UserType[]> {
    const password = await this.hashService.hash('password');
    const usersFields: CreateUserType[] = [
      {
        name: 'Admin User',
        username: 'damin',
        email: 'admin@admin.com',
        password: password,
        status: 'ACTIVE',
        roles: roles.filter((role) => role.name === 'admin'),
      },
    ];

    const users = await this.userRepository.store(usersFields);

    this.logger.debug({
      message: 'Production users seeded',
      context: this.context,
    });

    return users as UserType[];
  }
}

import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UserFilterType,
  UserRepositoryInterface,
  UserType,
  userErrorsCodes,
} from '../domain';

export class FindAllUsersUseCase {
  private readonly context = FindAllUsersUseCase.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType<UserFilterType>[],
  ): Promise<PaginatedResourceType<Partial<UserType>>> {
    try {
      const userResource = await this.userRepository.findAll(
        pagination,
        sort,
        filters,
      );

      return userResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM021,
        context: this.context,
        error,
      });
    }
  }
}

import { Controller, Get, Inject } from '@nestjs/common';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
} from '@common/helpers/domain';
import {
  PaginationParams,
  FilteringParams,
  SortingParams,
} from '@common/helpers/infrastructure';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { UserProvidersEnum, UserType, userErrorsCodes } from '../../domain';
import { FindAllUsersUseCase } from '../../application';
import { UserPresenter } from '../user.presenter';

@Controller()
export class FindAllUsersController {
  private readonly context = FindAllUsersController.name;

  constructor(
    @Inject(UserProvidersEnum.FIND_ALL_USERS_USE_CASE)
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/users')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams(['id', 'name', 'email']) sortParams?: SortingType,
    @FilteringParams(['id', 'name', 'email']) filterParams?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<UserType>>> {
    try {
      const users = await this.findAllUsersUseCase.run(
        paginationParams,
        sortParams,
        filterParams,
      );

      return {
        ...users,
        items: users.items.map((user) => new UserPresenter(user)),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM022,
        context: this.context,
        error,
      });
    }
  }
}

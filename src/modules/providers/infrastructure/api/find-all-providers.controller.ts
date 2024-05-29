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
import {
  ProviderProvidersEnum,
  ProviderType,
  providerErrorsCodes,
} from '../../domain';
import { FindAllProvidersUseCase } from '../../application';
import { ProviderPresenter } from '../provider.presenter';

@Controller()
export class FindAllProvidersController {
  private readonly context = FindAllProvidersController.name;

  constructor(
    @Inject(ProviderProvidersEnum.FIND_ALL_PROVIDERS_USE_CASE)
    private readonly findAllProvidersUseCase: FindAllProvidersUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/providers')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams(['id', 'name', 'email']) sortParams?: SortingType,
    @FilteringParams(['id', 'name', 'email']) filterParams?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<ProviderType>>> {
    try {
      const providers = await this.findAllProvidersUseCase.run(
        paginationParams,
        sortParams,
        filterParams,
      );

      return {
        ...providers,
        items: providers.items.map(
          (provider) => new ProviderPresenter(provider),
        ),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM022,
        context: this.context,
        error,
      });
    }
  }
}

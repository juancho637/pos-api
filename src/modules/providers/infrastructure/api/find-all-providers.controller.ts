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
  ProviderFilterType,
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
    @SortingParams<ProviderFilterType>('id', 'name', 'status')
    sortParams?: SortingType<ProviderFilterType>,
    @FilteringParams<ProviderFilterType>('id', 'name', 'status')
    filterParams?: FilteringType<ProviderFilterType>[],
  ): Promise<PaginatedResourceType<Partial<ProviderType>>> {
    try {
      this.logger.log({
        message: 'start finding all providers',
        context: this.context,
      });

      const providers = await this.findAllProvidersUseCase.run({
        pagination: paginationParams,
        sort: sortParams,
        filters: filterParams,
      });

      this.logger.log({
        message: `end finding all providers with ${JSON.stringify(providers)}`,
        context: this.context,
      });

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

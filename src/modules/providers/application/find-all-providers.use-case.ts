import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProviderFilterType,
  ProviderRepositoryInterface,
  ProviderType,
  providerErrorsCodes,
} from '../domain';

export class FindAllProvidersUseCase {
  private readonly context = FindAllProvidersUseCase.name;

  constructor(
    private readonly providerRepository: ProviderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType<ProviderFilterType>[],
  ): Promise<PaginatedResourceType<Partial<ProviderType>>> {
    try {
      const providerResource = await this.providerRepository.findAll(
        pagination,
        sort,
        filters,
      );

      return providerResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM021,
        context: this.context,
        error,
      });
    }
  }
}

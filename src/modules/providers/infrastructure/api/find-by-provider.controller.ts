import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ProviderProvidersEnum, providerErrorsCodes } from '../../domain';
import { FindByProviderUseCase } from '../../application';
import { ProviderPresenter } from '../provider.presenter';

@Controller()
export class FindByProviderController {
  private readonly context = FindByProviderController.name;

  constructor(
    @Inject(ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE)
    private readonly findByProviderUseCase: FindByProviderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/providers/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<ProviderPresenter> {
    try {
      const provider = await this.findByProviderUseCase.run(id);

      return new ProviderPresenter(provider);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM012,
        context: this.context,
        error,
      });
    }
  }
}
import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ProviderProvidersEnum, providerErrorsCodes } from '../../domain';
import { StoreProviderUseCase } from '../../application';
import { CreateProviderDto } from '../dto';
import { ProviderPresenter } from '../provider.presenter';

@Controller()
export class StoreProviderController {
  private readonly context = StoreProviderController.name;

  constructor(
    @Inject(ProviderProvidersEnum.STORE_PROVIDER_USE_CASE)
    private readonly storeProviderUseCase: StoreProviderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/providers')
  async run(
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<ProviderPresenter> {
    try {
      const provider = await this.storeProviderUseCase.run(createProviderDto);

      return new ProviderPresenter(provider);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM032,
        context: this.context,
        error,
      });
    }
  }
}

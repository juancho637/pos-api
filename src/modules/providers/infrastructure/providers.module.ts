import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from '@common/adapters/hash/infrastructure';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { LoggerModule } from '@common/adapters/logger/infrastructure';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ExceptionModule } from '@common/adapters/exception/infrastructure';
import { ProviderProvidersEnum, ProviderRepositoryInterface } from '../domain';
import {
  FindAllProvidersUseCase,
  DeleteProviderUseCase,
  FindByProviderUseCase,
  StoreProviderUseCase,
  UpdateProviderUseCase,
} from '../application';
import { ProviderEntity, ProviderTypeOrmRepository } from './persistence';
import {
  FindAllProvidersController,
  DeleteProviderController,
  FindByProviderController,
  StoreProviderController,
  UpdateProviderController,
} from './api';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProviderEntity]),
    LoggerModule,
    ExceptionModule,
    HashModule,
  ],
  controllers: [
    FindAllProvidersController,
    FindByProviderController,
    StoreProviderController,
    UpdateProviderController,
    DeleteProviderController,
  ],
  providers: [
    {
      provide: ProviderProvidersEnum.PROVIDER_REPOSITORY,
      useClass: ProviderTypeOrmRepository,
    },
    {
      inject: [
        ProviderProvidersEnum.PROVIDER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProviderProvidersEnum.FIND_ALL_PROVIDERS_USE_CASE,
      useFactory: (
        providerRepositoy: ProviderRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllProvidersUseCase(
          providerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProviderProvidersEnum.PROVIDER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
      useFactory: (
        providerRepositoy: ProviderRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByProviderUseCase(
          providerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProviderProvidersEnum.PROVIDER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProviderProvidersEnum.STORE_PROVIDER_USE_CASE,
      useFactory: (
        providerRepositoy: ProviderRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreProviderUseCase(
          providerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProviderProvidersEnum.PROVIDER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProviderProvidersEnum.UPDATE_PROVIDER_USE_CASE,
      useFactory: (
        providerRepositoy: ProviderRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateProviderUseCase(
          providerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProviderProvidersEnum.PROVIDER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProviderProvidersEnum.DELETE_PROVIDER_USE_CASE,
      useFactory: (
        providerRepositoy: ProviderRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteProviderUseCase(
          providerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    ProviderProvidersEnum.FIND_ALL_PROVIDERS_USE_CASE,
    ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
    ProviderProvidersEnum.STORE_PROVIDER_USE_CASE,
    ProviderProvidersEnum.UPDATE_PROVIDER_USE_CASE,
    ProviderProvidersEnum.DELETE_PROVIDER_USE_CASE,
  ],
})
export class ProviderModule {}

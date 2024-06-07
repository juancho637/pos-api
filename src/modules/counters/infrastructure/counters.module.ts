import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HashProvidersEnum,
  HashServiceInterface,
} from '@common/adapters/hash/domain';
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
import { CounterProvidersEnum, CounterRepositoryInterface } from '../domain';
import {
  DeleteCounterUseCase,
  FindAllCountersUseCase,
  FindByCounterUseCase,
  StoreCounterUseCase,
  UpdateCounterUseCase,
} from '../application';
import { CounterEntity, CounterTypeOrmRepository } from './persistence';
import {
  DeleteCounterController,
  FindAllCountersController,
  FindByCounterController,
  StoreCounterController,
  UpdateCounterController,
} from './api';

@Module({
  imports: [
    TypeOrmModule.forFeature([CounterEntity]),
    LoggerModule,
    ExceptionModule,
    HashModule,
  ],
  controllers: [
    FindAllCountersController,
    FindByCounterController,
    StoreCounterController,
    UpdateCounterController,
    DeleteCounterController,
  ],
  providers: [
    {
      provide: CounterProvidersEnum.COUNTER_REPOSITORY,
      useClass: CounterTypeOrmRepository,
    },
    {
      inject: [
        CounterProvidersEnum.COUNTER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CounterProvidersEnum.FIND_ALL_COUNTERS_USE_CASE,
      useFactory: (
        userRepositoy: CounterRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllCountersUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CounterProvidersEnum.COUNTER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CounterProvidersEnum.FIND_BY_COUNTER_USE_CASE,
      useFactory: (
        userRepositoy: CounterRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByCounterUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CounterProvidersEnum.COUNTER_REPOSITORY,
        HashProvidersEnum.HASH_SERVICE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CounterProvidersEnum.STORE_COUNTER_USE_CASE,
      useFactory: (
        userRepositoy: CounterRepositoryInterface,
        hashService: HashServiceInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreCounterUseCase(
          userRepositoy,
          hashService,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CounterProvidersEnum.COUNTER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CounterProvidersEnum.UPDATE_COUNTER_USE_CASE,
      useFactory: (
        userRepositoy: CounterRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateCounterUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CounterProvidersEnum.COUNTER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CounterProvidersEnum.DELETE_COUNTER_USE_CASE,
      useFactory: (
        userRepositoy: CounterRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteCounterUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    CounterProvidersEnum.FIND_ALL_COUNTERS_USE_CASE,
    CounterProvidersEnum.FIND_BY_COUNTER_USE_CASE,
    CounterProvidersEnum.STORE_COUNTER_USE_CASE,
    CounterProvidersEnum.UPDATE_COUNTER_USE_CASE,
    CounterProvidersEnum.DELETE_COUNTER_USE_CASE,
  ],
})
export class CounterModule {}

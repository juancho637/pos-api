import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
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
import {
  AppConfigType,
  ConfigurationType,
} from '@common/adapters/configuration/domain';
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
import { DevCountersSeeder } from './seeders';
import { UserProvidersEnum } from '@modules/users/domain';
import { FindByUserUseCase } from '@modules/users/application';
import { UserModule } from '@modules/users/infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([CounterEntity]),
    LoggerModule,
    ExceptionModule,
    forwardRef(() => UserModule),
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
      provide: CounterProvidersEnum.COUNTER_SEEDER,
      inject: [
        ConfigService,
        CounterProvidersEnum.COUNTER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
      ],
      useFactory: (
        configService: ConfigService<ConfigurationType>,
        customerRepositoy: CounterRepositoryInterface,
        loggerService: LoggerServiceInterface,
      ) => {
        const env = configService.get<AppConfigType>('app').env;

        return env !== 'prod'
          ? new DevCountersSeeder(customerRepositoy, loggerService)
          : null;
      },
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
        UserProvidersEnum.FIND_BY_USER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CounterProvidersEnum.STORE_COUNTER_USE_CASE,
      useFactory: (
        userRepositoy: CounterRepositoryInterface,
        findByUserUseCase: FindByUserUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreCounterUseCase(
          userRepositoy,
          findByUserUseCase,
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

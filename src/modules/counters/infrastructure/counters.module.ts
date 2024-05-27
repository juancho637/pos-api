import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeleteCounterController,
  FindAllCountersController,
  FindByCounterController,
  StoreCounterController,
  UpdateCounterController,
} from './api';
import { CounterEntity, CounterTypeOrmRepository } from './persistence';
import {
  DeleteCounterUseCase,
  FindAllCountersUseCase,
  FindByCounterUseCase,
  StoreCounterUseCase,
  UpdateCounterUseCase,
} from '../application';
import {
  ILoggerService,
  LoggerModule,
  LoggerProviders,
} from '@ecommerce/common/logger';
import {
  HashModule,
  HashProviders,
  IHashService,
} from '@ecommerce/common/hash';
import {
  ExceptionModule,
  ExceptionProviders,
  IExceptionService,
} from '@ecommerce/common/exception';
import { ICounterRepository, CounterProviders } from '../domain';
import { HashProvidersEnum } from '@common/adapters/hash/domain';

@Module({
  imports: [
    LoggerModule,
    ExceptionModule,
    TypeOrmModule.forFeature([CounterEntity]),
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
      provide: CounterProviders.ICounterRepository,
      useClass: CounterTypeOrmRepository,
    },
    {
      inject: [
        CounterProviders.ICounterRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: FindAllCountersUseCase,
      useFactory: (
        counterRepositoy: ICounterRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new FindAllCountersUseCase(counterRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        CounterProviders.ICounterRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: FindByCounterUseCase,
      useFactory: (
        counterRepositoy: ICounterRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new FindByCounterUseCase(counterRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        CounterProviders.ICounterRepository,
        HashProvidersEnum.HASH_SERVICE,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: StoreCounterUseCase,
      useFactory: (
        counterRepositoy: ICounterRepository,
        hashService: HashProvidersEnum.HASH_SERVICE,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new StoreCounterUseCase(
          counterRepositoy,
          hashService,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CounterProviders.ICounterRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: UpdateCounterUseCase,
      useFactory: (
        counterRepositoy: ICounterRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new UpdateCounterUseCase(counterRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        CounterProviders.ICounterRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: DeleteCounterUseCase,
      useFactory: (
        counterRepositoy: ICounterRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new DeleteCounterUseCase(counterRepositoy, loggerService, exceptionService),
    },
  ],
  exports: [CounterProviders.ICounterRepository],
})
export class CounterModule {}

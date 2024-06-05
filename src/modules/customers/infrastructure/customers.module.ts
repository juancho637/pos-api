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
import { UserProvidersEnum, UserRepositoryInterface } from '../domain';
import {
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindByUserUseCase,
  StoreUserUseCase,
  UpdateUserUseCase,
} from '../application';
import { UserEntity, UserTypeOrmRepository } from './persistence';
import {
  DeleteUserController,
  FindAllUsersController,
  FindByUserController,
  StoreUserController,
  UpdateUserController,
} from './api';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    LoggerModule,
    ExceptionModule,
    HashModule,
  ],
  controllers: [
    FindAllUsersController,
    FindByUserController,
    StoreUserController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    {
      provide: UserProvidersEnum.CUSTOMER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    {
      inject: [
        UserProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: UserProvidersEnum.FIND_ALL_CUSTOMERS_USE_CASE,
      useFactory: (
        userRepositoy: UserRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllUsersUseCase(userRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        UserProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: UserProvidersEnum.FIND_BY_CUSTOMER_USE_CASE,
      useFactory: (
        userRepositoy: UserRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByUserUseCase(userRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        UserProvidersEnum.CUSTOMER_REPOSITORY,
        HashProvidersEnum.HASH_SERVICE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: UserProvidersEnum.STORE_CUSTOMER_USE_CASE,
      useFactory: (
        userRepositoy: UserRepositoryInterface,
        hashService: HashServiceInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreUserUseCase(
          userRepositoy,
          hashService,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        UserProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: UserProvidersEnum.UPDATE_CUSTOMER_USE_CASE,
      useFactory: (
        userRepositoy: UserRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateUserUseCase(userRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        UserProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: UserProvidersEnum.DELETE_CUSTOMER_USE_CASE,
      useFactory: (
        userRepositoy: UserRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteUserUseCase(userRepositoy, loggerService, exceptionService),
    },
  ],
  exports: [
    UserProvidersEnum.FIND_ALL_CUSTOMERS_USE_CASE,
    UserProvidersEnum.FIND_BY_CUSTOMER_USE_CASE,
    UserProvidersEnum.STORE_CUSTOMER_USE_CASE,
    UserProvidersEnum.UPDATE_CUSTOMER_USE_CASE,
    UserProvidersEnum.DELETE_CUSTOMER_USE_CASE,
  ],
})
export class UserModule {}

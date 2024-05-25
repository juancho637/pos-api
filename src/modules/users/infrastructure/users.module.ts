import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeleteUserController,
  FindAllUsersController,
  FindByUserController,
  StoreUserController,
  UpdateUserController,
} from './api';
import { UserEntity, UserTypeOrmRepository } from './persistence';
import {
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindByUserUseCase,
  StoreUserUseCase,
  UpdateUserUseCase,
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
import { IUserRepository, UserProviders } from '../domain';
import { HashProvidersEnum } from '@common/adapters/hash/domain';

@Module({
  imports: [
    LoggerModule,
    ExceptionModule,
    TypeOrmModule.forFeature([UserEntity]),
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
      provide: UserProviders.IUserRepository,
      useClass: UserTypeOrmRepository,
    },
    {
      inject: [
        UserProviders.IUserRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: FindAllUsersUseCase,
      useFactory: (
        userRepositoy: IUserRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new FindAllUsersUseCase(userRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        UserProviders.IUserRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: FindByUserUseCase,
      useFactory: (
        userRepositoy: IUserRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new FindByUserUseCase(userRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        UserProviders.IUserRepository,
        HashProvidersEnum.HASH_SERVICE,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: StoreUserUseCase,
      useFactory: (
        userRepositoy: IUserRepository,
        hashService: HashProvidersEnum.HASH_SERVICE,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
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
        UserProviders.IUserRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: UpdateUserUseCase,
      useFactory: (
        userRepositoy: IUserRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new UpdateUserUseCase(userRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        UserProviders.IUserRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: DeleteUserUseCase,
      useFactory: (
        userRepositoy: IUserRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new DeleteUserUseCase(userRepositoy, loggerService, exceptionService),
    },
  ],
  exports: [UserProviders.IUserRepository],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from '@common/adapters/hash/infrastructure';
// import {
//   LoggerProvidersEnum,
//   LoggerServiceInterface,
// } from '@common/adapters/logger/domain';
import { LoggerModule } from '@common/adapters/logger/infrastructure';
// import {
//   ExceptionProvidersEnum,
//   ExceptionServiceInterface,
// } from '@common/adapters/exception/domain';
import { ExceptionModule } from '@common/adapters/exception/infrastructure';
import {
  PermissionProvidersEnum,
  // PermissionRepositoryInterface,
} from '../domain';
// import {
//   FindAllPermissionsUseCase,
//   FindByPermissionUseCase,
// } from '../application';
import { PermissionEntity, PermissionTypeOrmRepository } from './persistence';
// import {
//   FindAllPermissionsController,
//   FindByPermissionController,
// } from './api';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    LoggerModule,
    ExceptionModule,
    HashModule,
  ],
  // controllers: [FindAllPermissionsController, FindByPermissionController],
  providers: [
    {
      provide: PermissionProvidersEnum.PERMISSION_REPOSITORY,
      useClass: PermissionTypeOrmRepository,
    },
    // {
    //   inject: [
    //     PermissionProvidersEnum.PERMISSION_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //     ExceptionProvidersEnum.EXCEPTION_SERVICE,
    //   ],
    //   provide: PermissionProvidersEnum.FIND_ALL_PERMISSIONS_USE_CASE,
    //   useFactory: (
    //     PermissionRepositoy: PermissionRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //     exceptionService: ExceptionServiceInterface,
    //   ) =>
    //     new FindAllPermissionsUseCase(
    //       PermissionRepositoy,
    //       loggerService,
    //       exceptionService,
    //     ),
    // },
    // {
    //   inject: [
    //     PermissionProvidersEnum.PERMISSION_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //     ExceptionProvidersEnum.EXCEPTION_SERVICE,
    //   ],
    //   provide: PermissionProvidersEnum.FIND_BY_PERMISSION_USE_CASE,
    //   useFactory: (
    //     PermissionRepositoy: PermissionRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //     exceptionService: ExceptionServiceInterface,
    //   ) =>
    //     new FindByPermissionUseCase(
    //       PermissionRepositoy,
    //       loggerService,
    //       exceptionService,
    //     ),
    // },
  ],
  exports: [
    // PermissionProvidersEnum.FIND_ALL_PERMISSIONS_USE_CASE,
    // PermissionProvidersEnum.FIND_BY_PERMISSION_USE_CASE,
  ],
})
export class PermissionModule {}

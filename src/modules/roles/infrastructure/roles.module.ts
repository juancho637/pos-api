import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { RoleProvidersEnum, RoleRepositoryInterface } from '../domain';
import { FindAllRolesUseCase, FindByRoleUseCase } from '../application';
import { RoleEntity, RoleTypeOrmRepository } from './persistence';
import { RolesSeeder } from './seeders';
// import { PermissionModule } from '@modules/permissions/infrastructure';
import {
  // FindAllRolesController,
  FindByRoleController,
} from './api';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    // forwardRef(() => PermissionModule),
    LoggerModule,
    ExceptionModule,
  ],
  controllers: [
    // FindAllRolesController,
    FindByRoleController,
  ],
  providers: [
    {
      provide: RoleProvidersEnum.ROLE_REPOSITORY,
      useClass: RoleTypeOrmRepository,
    },
    {
      provide: RoleProvidersEnum.ROLE_SEEDER,
      inject: [
        RoleProvidersEnum.ROLE_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
      ],
      useFactory: (
        roleRepositoy: RoleRepositoryInterface,
        loggerService: LoggerServiceInterface,
      ) => new RolesSeeder(roleRepositoy, loggerService),
    },
    {
      inject: [
        RoleProvidersEnum.ROLE_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: RoleProvidersEnum.FIND_ALL_ROLES_USE_CASE,
      useFactory: (
        RoleRepositoy: RoleRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllRolesUseCase(RoleRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        RoleProvidersEnum.ROLE_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: RoleProvidersEnum.FIND_BY_ROLE_USE_CASE,
      useFactory: (
        RoleRepositoy: RoleRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByRoleUseCase(RoleRepositoy, loggerService, exceptionService),
    },
  ],
  exports: [
    RoleProvidersEnum.FIND_ALL_ROLES_USE_CASE,
    RoleProvidersEnum.FIND_BY_ROLE_USE_CASE,
  ],
})
export class RoleModule {}

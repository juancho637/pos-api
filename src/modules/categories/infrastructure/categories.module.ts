import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import {
  AppConfigType,
  ConfigurationType,
} from '@common/adapters/configuration/domain';
import { ExceptionModule } from '@common/adapters/exception/infrastructure';
import { CategoryProvidersEnum, CategoryRepositoryInterface } from '../domain';
import {
  DeleteCategoryUseCase,
  FindAllCategoriesUseCase,
  FindByCategoryUseCase,
  StoreCategoryUseCase,
  UpdateCategoryUseCase,
} from '../application';
import { CategoryEntity, CategoryTypeOrmRepository } from './persistence';
import {
  DeleteCategoryController,
  FindAllCategoriesController,
  FindByCategoryController,
  StoreCategoryController,
  UpdateCategoryController,
} from './api';
import { DevCategoriesSeeder } from './seeders';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    LoggerModule,
    ExceptionModule,
    HashModule,
  ],
  controllers: [
    FindAllCategoriesController,
    FindByCategoryController,
    StoreCategoryController,
    UpdateCategoryController,
    DeleteCategoryController,
  ],
  providers: [
    {
      provide: CategoryProvidersEnum.CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
    {
      provide: CategoryProvidersEnum.CATEGORY_SEEDER,
      inject: [
        ConfigService,
        CategoryProvidersEnum.CATEGORY_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
      ],
      useFactory: (
        configService: ConfigService<ConfigurationType>,
        categoryRepositoy: CategoryRepositoryInterface,
        loggerService: LoggerServiceInterface,
      ) => {
        const env = configService.get<AppConfigType>('app').env;

        return env !== 'prod'
          ? new DevCategoriesSeeder(categoryRepositoy, loggerService)
          : null;
      },
    },
    {
      inject: [
        CategoryProvidersEnum.CATEGORY_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CategoryProvidersEnum.FIND_ALL_CATEGORIES_USE_CASE,
      useFactory: (
        userRepositoy: CategoryRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllCategoriesUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CategoryProvidersEnum.CATEGORY_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CategoryProvidersEnum.FIND_BY_CATEGORY_USE_CASE,
      useFactory: (
        userRepositoy: CategoryRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByCategoryUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CategoryProvidersEnum.CATEGORY_REPOSITORY,
        HashProvidersEnum.HASH_SERVICE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CategoryProvidersEnum.STORE_CATEGORY_USE_CASE,
      useFactory: (
        userRepositoy: CategoryRepositoryInterface,
        hashService: HashServiceInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreCategoryUseCase(
          userRepositoy,
          hashService,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CategoryProvidersEnum.CATEGORY_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CategoryProvidersEnum.UPDATE_CATEGORY_USE_CASE,
      useFactory: (
        userRepositoy: CategoryRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateCategoryUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CategoryProvidersEnum.CATEGORY_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CategoryProvidersEnum.DELETE_CATEGORY_USE_CASE,
      useFactory: (
        userRepositoy: CategoryRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteCategoryUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    CategoryProvidersEnum.FIND_ALL_CATEGORIES_USE_CASE,
    CategoryProvidersEnum.FIND_BY_CATEGORY_USE_CASE,
    CategoryProvidersEnum.STORE_CATEGORY_USE_CASE,
    CategoryProvidersEnum.UPDATE_CATEGORY_USE_CASE,
    CategoryProvidersEnum.DELETE_CATEGORY_USE_CASE,
  ],
})
export class CategoryModule {}

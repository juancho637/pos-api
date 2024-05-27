import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeleteCategoryController,
  FindAllCategorysController,
  FindByCategoryController,
  StoreCategoryController,
  UpdateCategoryController,
} from './api';
import { CategoryEntity, CategoryTypeOrmRepository } from './persistence';
import {
  DeleteCategoryUseCase,
  FindAllCategorysUseCase,
  FindByCategoryUseCase,
  StoreCategoryUseCase,
  UpdateCategoryUseCase,
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
import { ICategoryRepository, CategoryProviders } from '../domain';
import { HashProvidersEnum } from '@common/adapters/hash/domain';

@Module({
  imports: [
    LoggerModule,
    ExceptionModule,
    TypeOrmModule.forFeature([CategoryEntity]),
    HashModule,
  ],
  controllers: [
    FindAllCategorysController,
    FindByCategoryController,
    StoreCategoryController,
    UpdateCategoryController,
    DeleteCategoryController,
  ],
  providers: [
    {
      provide: CategoryProviders.ICategoryRepository,
      useClass: CategoryTypeOrmRepository,
    },
    {
      inject: [
        CategoryProviders.ICategoryRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: FindAllCategorysUseCase,
      useFactory: (
        categoryRepositoy: ICategoryRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new FindAllCategorysUseCase(categoryRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        CategoryProviders.ICategoryRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: FindByCategoryUseCase,
      useFactory: (
        categoryRepositoy: ICategoryRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new FindByCategoryUseCase(categoryRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        CategoryProviders.ICategoryRepository,
        HashProvidersEnum.HASH_SERVICE,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: StoreCategoryUseCase,
      useFactory: (
        categoryRepositoy: ICategoryRepository,
        hashService: HashProvidersEnum.HASH_SERVICE,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new StoreCategoryUseCase(
          categoryRepositoy,
          hashService,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CategoryProviders.ICategoryRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: UpdateCategoryUseCase,
      useFactory: (
        categoryRepositoy: ICategoryRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new UpdateCategoryUseCase(categoryRepositoy, loggerService, exceptionService),
    },
    {
      inject: [
        CategoryProviders.ICategoryRepository,
        LoggerProviders.ILoggerService,
        ExceptionProviders.IExceptionService,
      ],
      provide: DeleteCategoryUseCase,
      useFactory: (
        categoryRepositoy: ICategoryRepository,
        loggerService: ILoggerService,
        exceptionService: IExceptionService,
      ) =>
        new DeleteCategoryUseCase(categoryRepositoy, loggerService, exceptionService),
    },
  ],
  exports: [CategoryProviders.ICategoryRepository],
})
export class CategoryModule {}

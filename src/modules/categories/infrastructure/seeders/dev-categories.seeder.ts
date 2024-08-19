import { faker } from '@faker-js/faker';
import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import {
  CreateCategoryType,
  CategoryRepositoryInterface,
  CategoryType,
} from '../../domain';

export class DevCategoriesSeeder {
  private readonly context = DevCategoriesSeeder.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(): Promise<CategoryType[]> {
    const categoriesFields: CreateCategoryType[] = [];

    categoriesFields.push({
      name: 'GENERICO',
      description: 'DESCRIPCION GENERICA',
    });

    for (let i = 0; i < 10; i++) {
      const categoryInfo = faker.commerce;

      categoriesFields.push({
        name: categoryInfo.productAdjective(),
        description: categoryInfo.productDescription(),
      });
    }

    const categories = await this.categoryRepository.store(categoriesFields);

    this.logger.debug({
      message: 'Development categories seeded',
      context: this.context,
    });

    return categories as CategoryType[];
  }
}

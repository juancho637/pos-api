import { faker } from '@faker-js/faker';
import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { CategoryRepositoryInterface, CategoryType } from '../../domain';
import { CreateCategoryRepositoryType } from '@modules/categories/domain/create-category-repository.type';

export class DevCategoriesSeeder {
  private readonly context = DevCategoriesSeeder.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(): Promise<CategoryType[]> {
    const categoriesFields: CreateCategoryRepositoryType[] = [];

    categoriesFields.push({
      name: 'GENERICO',
      description: 'DESCRIPCION GENERICA',
      status: 'ACTIVE',
    });

    for (let i = 0; i < 10; i++) {
      const categoryInfo = faker.commerce;

      categoriesFields.push({
        name: categoryInfo.productAdjective(),
        description: categoryInfo.productDescription(),
        status: 'ACTIVE',
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

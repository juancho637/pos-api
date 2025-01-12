import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PermissionProvidersEnum } from '@modules/permissions/domain';
import { RoleProvidersEnum } from '@modules/roles/domain';
import { UserProvidersEnum } from '@modules/users/domain';
import { CategoryProvidersEnum } from '@modules/categories/domain';
// import { ProductProvidersEnum } from '@modules/products/domain';
import { CustomerProvidersEnum } from '@modules/customers/domain';
import { CounterProvidersEnum } from '@modules/counters/domain';
import { OrderProvidersEnum } from '@modules/orders/domain';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const PermissionSeeder = app.get(PermissionProvidersEnum.PERMISSION_SEEDER);
  const permissions = await PermissionSeeder.seed();

  const customerSeeder = app.get(CustomerProvidersEnum.CUSTOMER_SEEDER);
  const customers = await customerSeeder.seed();

  const roleSeeder = app.get(RoleProvidersEnum.ROLE_SEEDER);
  const roles = await roleSeeder.seed(permissions);

  const categorySeeder = app.get(CategoryProvidersEnum.CATEGORY_SEEDER);
  await categorySeeder.seed();

  // const productSeeder = app.get(ProductProvidersEnum.PRODUCT_SEEDER);
  // await productSeeder.seed(categories);

  const userSeeder = app.get(UserProvidersEnum.USER_SEEDER);
  const users = await userSeeder.seed(roles);

  const counterSeeder = app.get(CounterProvidersEnum.COUNTER_SEEDER);
  const counters = await counterSeeder.seed(users);

  const orderSeeder = app.get(OrderProvidersEnum.ORDER_SEEDER);
  await orderSeeder.seed(counters, customers);

  await app.close();
}

bootstrap().catch((err) => console.error(err));

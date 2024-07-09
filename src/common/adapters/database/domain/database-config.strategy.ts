import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfigStrategy {
  createTypeOrmOptions(): TypeOrmModuleOptions;
}

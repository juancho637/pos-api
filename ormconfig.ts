import { join } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { DatabasesTypes } from '@common/adapters/configuration/domain';

dotenv.config();

const migrationsPath = join(
  __dirname,
  'database',
  'migrations',
  '**',
  '*.{ts,js}',
);

export default process.env.DB_TYPE === 'sqlite'
  ? new DataSource({
      type: process.env.DB_TYPE as DatabasesTypes,
      database: join(__dirname, 'database', 'database.sqlite'),
      logging: process.env.TYPEORM_LOGGING === 'true',
      synchronize: false,
      migrations: [migrationsPath],
    })
  : new DataSource({
      type: process.env.DB_TYPE as DatabasesTypes,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: process.env.TYPEORM_LOGGING === 'true',
      synchronize: false,
      migrations: [migrationsPath],
    });

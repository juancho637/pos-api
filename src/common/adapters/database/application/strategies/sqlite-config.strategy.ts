import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmConfigType } from '@common/adapters/configuration/domain';
import { DatabaseConfigStrategy } from '../../domain';

@Injectable()
export class SqliteConfigStrategy implements DatabaseConfigStrategy {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const typeOrm = this.configService.get<TypeOrmConfigType>('typeOrm');

    return {
      type: 'sqlite',
      database: join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'database',
        'database.sqlite',
      ),
      logging: typeOrm.logging,
      synchronize: typeOrm.synchronize,
      autoLoadEntities: true,
      entities: [
        join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'modules',
          '**',
          '*.entity.{ts,js}',
        ),
      ],
    };
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseConfigStrategy } from '../domain';
import { PostgresConfigStrategy, SqliteConfigStrategy } from './strategies';

@Injectable()
export class GetDatabaseConnectionFactory {
  constructor(
    private readonly sqliteConfigStrategy: SqliteConfigStrategy,
    private readonly postgresConfigStrategy: PostgresConfigStrategy,
  ) {}

  run(strategy: string): DatabaseConfigStrategy {
    return this.strategies[strategy];
  }

  private strategies: Record<string, DatabaseConfigStrategy> = {
    sqlite: this.sqliteConfigStrategy,
    postgres: this.postgresConfigStrategy,
  };
}

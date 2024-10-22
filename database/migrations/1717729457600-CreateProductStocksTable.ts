import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductStocksTable1717729457600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'counters',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'product_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'provider_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sku',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: true,
          },
          {
            name: 'start_time',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'product_stocks',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
      }),
    );

    await queryRunner.createForeignKey(
      'product_stocks',
      new TableForeignKey({
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'providers',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_stocks');

    const productForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_id') !== -1,
    );

    const providerForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('provider_id') !== -1,
    );

    productForeignKey &&
      (await queryRunner.dropForeignKey('product_stocks', productForeignKey));

    providerForeignKey &&
      (await queryRunner.dropForeignKey('product_stocks', providerForeignKey));

    await queryRunner.dropTable('product_stocks');
  }
}

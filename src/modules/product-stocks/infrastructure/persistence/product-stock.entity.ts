import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductStockType } from '../../domain';
import { ProductEntity } from '@modules/products/infrastructure';
import { ProductType } from '@modules/products/domain';
import { ProviderEntity } from '@modules/providers/infrastructure';
import { ProviderType } from '@modules/providers/domain';

@Entity({ name: 'product_stocks' })
export class ProductStockEntity implements ProductStockType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', name: 'product_id' })
  @OneToOne(() => ProductEntity, (productEntity) => productEntity.id)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductType;

  @Column({ type: 'real', name: 'provider_id' })
  @OneToOne(() => ProviderEntity, (providerEntity) => providerEntity.id)
  @JoinColumn({ name: 'provider_id', referencedColumnName: 'id' })
  provider: ProviderType;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  sku: string;

  @Column({
    type: 'real',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: true,
  })
  status: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;
}

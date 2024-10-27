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
import { OrderEntity } from '@modules/orders/infrastructure';

import { OrderDetailType } from '../../domain';
import { ProductStockEntity } from '@modules/product-stocks/infrastructure';
import { ProductStockType } from '@modules/product-stocks/domain';
import { OrderType } from '@modules/orders/domain';

@Entity({ name: 'counters' })
export class OrderDetailEntity implements OrderDetailType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fee: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  price: number;

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

  @Column({ type: 'real', name: 'product_stock_id' })
  @OneToOne(
    () => ProductStockEntity,
    (productStockEntity) => productStockEntity.id,
  )
  @JoinColumn({ name: 'product_stock_id', referencedColumnName: 'id' })
  productStock: ProductStockType;

  @Column({ type: 'real', name: 'order_id' })
  @OneToOne(() => OrderEntity, (orderEntity) => orderEntity.id)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderType;
}

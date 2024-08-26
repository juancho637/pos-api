import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '@modules/customers/infrastructure';
import { CounterEntity } from '@modules/counters/infrastructure';
import { OrderType } from '../../domain';

@Entity({ name: 'orders' })
export class OrderEntity implements OrderType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  type: string;

  @Column({
    name: 'subtotal_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  subtotalPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  fee: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  totalPrice: number;

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

  @ManyToOne(() => CounterEntity, (counter) => counter.orders)
  @JoinColumn({ name: 'counter_id' })
  counter: CounterEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity;
}

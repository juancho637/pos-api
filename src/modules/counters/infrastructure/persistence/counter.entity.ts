import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from '@modules/orders/infrastructure';
import { CounterType } from '../../domain';

@Entity({ name: 'counters' })
export class CounterEntity implements CounterType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  branch_id: number;

  @Column({
    type: 'integer',
    nullable: false,
    unique: true,
  })
  user_id: number;

  @Column({
    type: 'integer',
    nullable: false,
    unique: true,
  })
  base: number;

  @Column({
    type: 'real',
    nullable: false,
    unique: true,
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

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];
}

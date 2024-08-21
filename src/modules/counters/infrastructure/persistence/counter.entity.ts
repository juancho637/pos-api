import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from '@modules/orders/infrastructure';
import { UserEntity } from '@modules/users/infrastructure';
import { CounterType } from '../../domain';

@Entity({ name: 'counters' })
export class CounterEntity implements CounterType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  base: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: string;

  @Column({
    type: 'datetime',
    name: 'start_time',
    nullable: false,
  })
  startTime: Date;

  @Column({
    type: 'datetime',
    name: 'end_time',
    nullable: false,
  })
  endTime: Date;

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

  @ManyToOne(() => UserEntity, (user) => user.counters)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];
}

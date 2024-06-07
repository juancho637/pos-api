import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
    type: 'int',
    nullable: false,
    unique: true,
  })
  user_id: number;

  @Column({
    type: 'int',
    nullable: false,
    unique: true,
  })
  base: number;

  @Column({
    type: 'double',
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
}

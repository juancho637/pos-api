import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryType } from '../../domain';

@Entity({ name: 'counters' })
export class CategoryEntity implements CategoryType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    unique: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 400,
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

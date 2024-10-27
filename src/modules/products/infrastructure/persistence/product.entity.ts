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
import { ProductType } from '../../domain';
import { CategoryEntity } from '@modules/categories/infrastructure';
import { CategoryType } from '@modules/categories/domain';

@Entity({ name: 'products' })
export class ProductEntity implements ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  name: string;

  @Column({ type: 'real', name: 'category_id' })
  @OneToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.id)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoryType;

  @Column({
    type: 'real',
    nullable: false,
  })
  fee: number;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'real',
    nullable: false,
    name: 'min_stock',
  })
  minStock: number;

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

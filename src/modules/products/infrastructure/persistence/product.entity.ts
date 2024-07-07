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
  category: number;

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
  })
  min_stock: number;

  @Column({
    type: 'varchar',
    nullable: false,
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

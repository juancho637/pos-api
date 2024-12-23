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
import { CustomerType } from '../../domain';

@Entity({ name: 'customers' })
export class CustomerEntity implements CustomerType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'active',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'type_identification',
  })
  typeIdentification: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  identification: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'full_name',
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    name: 'cell_phone',
  })
  cellPhone: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  birthdate: Date;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  gender: string;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];
}

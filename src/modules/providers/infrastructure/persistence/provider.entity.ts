import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProviderType } from '../../domain';

@Entity({ name: 'providers' })
export class ProviderEntity implements ProviderType {
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
    nullable: false,
    default: true,
  })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'now()',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date;
}

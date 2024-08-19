import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import {
  CreateOrderRepositoryType,
  OrderFilterType,
  OrderType,
  UpdateOrderRepositoryType,
} from './types';

export interface OrderRepositoryInterface<
  Entity extends OrderType = OrderType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<OrderFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<OrderFilterType>,
  ): Promise<PaginatedResourceType<Entity>>;
  store(
    createOrderFields: CreateOrderRepositoryType | CreateOrderRepositoryType[],
  ): Promise<Entity | Entity[]>;
  update(
    id: number,
    updateOrderFields: UpdateOrderRepositoryType,
  ): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

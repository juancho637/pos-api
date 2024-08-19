import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { OrderType } from './order.type';
import { OrderFilterType } from './order-filter.type';
import { CreateOrderType } from './create-order.type';
import { UpdateOrderType } from './update-order.type';

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
    createOrderFields: CreateOrderType | CreateOrderType[],
  ): Promise<Entity | Entity[]>;
  update(id: number, updateOrderFields: UpdateOrderType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

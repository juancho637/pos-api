import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { OrderDetailType } from './order-detail.type';
import { UpdateOrderDetailType } from './update-order-detail.type';
import { OrderDetailFilterType } from './order-detail-filter.type';
import { CreateOrderDetailRepositoryType } from './types';

export interface OrderDetailRepositoryInterface<
  Entity extends OrderDetailType = OrderDetailType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<OrderDetailFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<OrderDetailFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(
    createOrderDetailFields:
      | CreateOrderDetailRepositoryType
      | CreateOrderDetailRepositoryType[],
  ): Promise<Entity | Entity[]>;
  update(
    id: number,
    updateOrderDetailFields: UpdateOrderDetailType,
  ): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

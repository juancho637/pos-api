import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { OrderDetailType } from './order-detail.type';
import { OrderDetailFilterType } from './order-detail-filter.type';
import { CreateOrderDetailRepositoryType } from './types';
import { UpdateOrderDetailRepositoryType } from './update-order-detail-repository.type';

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
    updateOrderDetailFields: UpdateOrderDetailRepositoryType,
  ): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

import { ProductStockPresenter } from '@modules/product-stocks/infrastructure';
import { OrderDetailType } from '../domain';
import { OrderPresenter } from '@modules/orders/infrastructure';

export class OrderDetailPresenter {
  id: number;
  productStock: ProductStockPresenter;
  order: OrderPresenter;
  quantity: number;
  fee: number;
  price: number;
  created_at: Date;
  updated_at: Date;

  constructor(orderDetail: Partial<OrderDetailType>) {
    this.id = orderDetail.id;
    this.productStock = new ProductStockPresenter(orderDetail.productStock);
    this.order = new OrderPresenter(orderDetail.order);
    this.quantity = orderDetail.quantity;
    this.fee = orderDetail.fee;
    this.price = orderDetail.price;
    this.created_at = orderDetail.createdAt;
    this.updated_at = orderDetail.updatedAt;
  }
}

import { CustomerPresenter } from '@modules/customers/infrastructure';
import { CounterPresenter } from '@modules/counters/infrastructure';
import { OrderType } from '../domain';

export class OrderPresenter {
  id: number;
  type: string;
  subtotal_price: number;
  fee: number;
  total_price: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  customer: CustomerPresenter;
  counter: CounterPresenter;

  constructor(user: Partial<OrderType>) {
    this.id = user.id;
    this.type = user.type;
    this.subtotal_price = user.subtotalPrice;
    this.fee = user.fee;
    this.total_price = user.totalPrice;
    this.status = user.status;
    this.created_at = user.createdAt;
    this.updated_at = user.updatedAt;
    user.customer && (this.customer = new CustomerPresenter(user.customer));
    user.counter && (this.counter = new CounterPresenter(user.counter));
  }
}

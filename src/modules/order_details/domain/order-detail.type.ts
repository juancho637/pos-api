import { OrderType } from '@modules/orders/domain';
import { ProductStockType } from 'src/modules/product-stocks/domain';

export type OrderDetailType = {
  id: number;
  productStock: ProductStockType;
  order: OrderType;
  quantity: number;
  fee: number;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  orders?: OrderType[];
  productStocks?: ProductStockType[];
};

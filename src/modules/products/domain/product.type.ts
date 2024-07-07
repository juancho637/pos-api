export type ProductType = {
  id: number;
  name: string;
  category: number;
  fee: number;
  description: string;
  type: string;
  min_stock: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date;
};

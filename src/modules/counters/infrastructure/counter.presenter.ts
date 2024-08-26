import { CounterType } from '../domain';

export class CounterPresenter {
  id: number;
  base: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(counter: Partial<CounterType>) {
    this.id = counter.id;
    this.base = counter.base;
    this.status = counter.status;
    this.createdAt = counter.createdAt;
    this.updatedAt = counter.updatedAt;
    // this.user_id = counter.userId;
  }
}

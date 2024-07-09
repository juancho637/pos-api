import { CounterType } from '../domain';

export class CounterPresenter {
  id: number;
  branch_id: number;
  user_id: number;
  base: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(counter: Partial<CounterType>) {
    this.id = counter.id;
    this.branch_id = counter.branch_id;
    this.user_id = counter.user_id;
    this.base = counter.base;
    this.status = counter.status;
    this.createdAt = counter.createdAt;
    this.updatedAt = counter.updatedAt;
  }
}

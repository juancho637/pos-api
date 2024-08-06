import { RoleType } from '../domain';

export class RolePresenter {
  id: number;
  name: string;
  status: string;
  description: string;
  created_at: Date;
  updated_at: Date;

  constructor(user: Partial<RoleType>) {
    this.id = user.id;
    this.name = user.name;
    this.status = user.status;
    this.description = user.description;
    this.created_at = user.createdAt;
    this.updated_at = user.updatedAt;
  }
}

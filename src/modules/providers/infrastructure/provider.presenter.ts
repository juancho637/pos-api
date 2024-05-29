import { ProviderType } from '../domain';

export class ProviderPresenter {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;

  constructor(provider: Partial<ProviderType>) {
    this.id = provider.id;
    this.name = provider.name;
    this.created_at = provider.createdAt;
    this.updated_at = provider.updatedAt;
  }
}

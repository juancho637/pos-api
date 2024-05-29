import { ProviderType } from './provider.type';

export type CreateProviderType = Omit<
  ProviderType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;

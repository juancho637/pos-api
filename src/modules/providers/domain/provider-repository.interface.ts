import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { ProviderType } from './provider.type';
import { CreateProviderType } from './create-provider.type';
import { UpdateProviderType } from './update-provider.type';
import { ProviderFilterType } from './provider-filter.type';

export interface ProviderRepositoryInterface<
  Entity extends ProviderType = ProviderType,
> {
  findOneBy(fields: ProviderFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createProviderFields: CreateProviderType): Promise<Entity>;
  update(id: number, updateProviderFields: UpdateProviderType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}

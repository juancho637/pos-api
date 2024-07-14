import { UserFilterType } from '../user-filter.type';
import { UserType } from '../user.type';

export interface FindByUserUseCaseInterface<
  Entity extends UserType = UserType,
> {
  run(userFilters: UserFilterType, relations?: string[]): Promise<Entity>;
}

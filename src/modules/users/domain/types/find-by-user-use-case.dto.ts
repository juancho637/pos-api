import { AuthUserType } from '@modules/auth/domain';
import { UserFilterType } from '../user-filter.type';

export type FindByUserUseCaseDto = {
  userFilters: UserFilterType;
  relations?: string[];
  authUser?: AuthUserType;
};

import { FilterRuleEnum } from '../enums';

export type FilteringType<T> = {
  property: T;
  rule: FilterRuleEnum;
  value: string;
};

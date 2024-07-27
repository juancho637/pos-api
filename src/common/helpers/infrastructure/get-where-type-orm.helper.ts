import {
  IsNull,
  MoreThan,
  MoreThanOrEqual,
  Not,
  LessThan,
  LessThanOrEqual,
  ILike,
  In,
} from 'typeorm';
import { FilterRuleEnum, FilteringType } from '../domain';

export const getWhereTypeOrmHelper = <T>(filters: FilteringType<T>[]) => {
  if (!filters) return {};

  return filters.map((filter) => {
    const { property, rule, value } = filter;
    const propertyString = property as string;
    const ruleString = rule.toString();

    if (ruleString == FilterRuleEnum.IS_NULL)
      return { [propertyString]: IsNull() };

    if (ruleString == FilterRuleEnum.IS_NOT_NULL)
      return { [propertyString]: Not(IsNull()) };

    if (ruleString == FilterRuleEnum.EQUALS) return { [propertyString]: value };

    if (ruleString == FilterRuleEnum.NOT_EQUALS)
      return { [propertyString]: Not(value) };

    if (ruleString == FilterRuleEnum.GREATER_THAN)
      return { [propertyString]: MoreThan(value) };

    if (ruleString == FilterRuleEnum.GREATER_THAN_OR_EQUALS)
      return { [propertyString]: MoreThanOrEqual(value) };

    if (ruleString == FilterRuleEnum.LESS_THAN)
      return { [propertyString]: LessThan(value) };

    if (ruleString == FilterRuleEnum.LESS_THAN_OR_EQUALS)
      return { [propertyString]: LessThanOrEqual(value) };

    if (ruleString == FilterRuleEnum.LIKE)
      return { [propertyString]: ILike(`%${value}%`) };

    if (ruleString == FilterRuleEnum.NOT_LIKE)
      return { [propertyString]: Not(ILike(`%${value}%`)) };

    if (ruleString == FilterRuleEnum.IN)
      return { [propertyString]: In(value.split(',')) };

    if (ruleString == FilterRuleEnum.NOT_IN)
      return { [propertyString]: Not(In(value.split(','))) };
  });
};

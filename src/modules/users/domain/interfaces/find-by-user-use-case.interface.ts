import { FindByUserUseCaseDto } from '../types';
import { UserType } from '../user.type';

export interface FindByUserUseCaseInterface<
  Entity extends UserType = UserType,
> {
  run(findByUserUseCaseDto: FindByUserUseCaseDto): Promise<Entity>;
}

import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { FilterRuleEnum } from '@common/helpers/domain';
import { FindByUserUseCase } from '@modules/users/application';
import {
  userErrorsCodes,
  UserProvidersEnum,
  UserRepositoryInterface,
} from '@modules/users/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { internalServerErrorExceptionMock, userMock } from '@test/mocks';

describe('FindByUserUseCase', () => {
  const context = 'FindByUserUseCase';
  let findByUserUseCase: FindByUserUseCase;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserProvidersEnum.USER_REPOSITORY,
          useValue: {
            findOneBy: jest.fn().mockReturnValue(userMock),
          },
        },
        {
          provide: LoggerProvidersEnum.LOGGER_SERVICE,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: ExceptionProvidersEnum.EXCEPTION_SERVICE,
          useValue: {
            internalServerErrorException: jest.fn(() => {
              throw internalServerErrorExceptionMock({
                context,
                message: userErrorsCodes.UM051,
              });
            }),
          },
        },
        {
          inject: [
            UserProvidersEnum.USER_REPOSITORY,
            LoggerProvidersEnum.LOGGER_SERVICE,
            ExceptionProvidersEnum.EXCEPTION_SERVICE,
          ],
          provide: FindByUserUseCase,
          useFactory: (
            userRepository: UserRepositoryInterface,
            loggerService: LoggerServiceInterface,
            exceptionService: ExceptionServiceInterface,
          ) =>
            new FindByUserUseCase(
              userRepository,
              loggerService,
              exceptionService,
            ),
        },
      ],
    }).compile();

    findByUserUseCase = module.get<FindByUserUseCase>(FindByUserUseCase);
    userRepository = module.get<UserRepositoryInterface>(
      UserProvidersEnum.USER_REPOSITORY,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(findByUserUseCase).toBeDefined();
      expect(userRepository).toBeDefined();
    });
  });

  describe('Use Case', () => {
    it('should call run method and return a findOneBy user', async () => {
      const repositorySpy = jest.spyOn(userRepository, 'findOneBy');

      const resp = await findByUserUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: userMock.id,
        },
      });

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock);
    });

    it('should throw an error when the repository throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(userRepository, 'findOneBy').mockRejectedValue(errorMock);

      await expect(
        findByUserUseCase.run({
          filter: {
            property: 'id',
            rule: FilterRuleEnum.EQUALS,
            value: userMock.id,
          },
        }),
      ).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM051,
        }),
      );
    });
  });
});

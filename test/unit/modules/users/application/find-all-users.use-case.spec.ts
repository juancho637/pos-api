import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { FindAllUsersUseCase } from '@modules/users/application';
import {
  userErrorsCodes,
  UserProvidersEnum,
  UserRepositoryInterface,
} from '@modules/users/domain';
import { Test, TestingModule } from '@nestjs/testing';
import {
  internalServerErrorExceptionMock,
  paginatedUsersMock,
} from '@test/mocks';

describe('FindAllUsersUseCase', () => {
  const context = 'FindAllUsersUseCase';
  let findAllUsersUseCase: FindAllUsersUseCase;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserProvidersEnum.USER_REPOSITORY,
          useValue: {
            findAll: jest.fn().mockReturnValue(paginatedUsersMock),
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
          provide: FindAllUsersUseCase,
          useFactory: (
            userRepository: UserRepositoryInterface,
            loggerService: LoggerServiceInterface,
            exceptionService: ExceptionServiceInterface,
          ) =>
            new FindAllUsersUseCase(
              userRepository,
              loggerService,
              exceptionService,
            ),
        },
      ],
    }).compile();

    findAllUsersUseCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
    userRepository = module.get<UserRepositoryInterface>(
      UserProvidersEnum.USER_REPOSITORY,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(findAllUsersUseCase).toBeDefined();
      expect(userRepository).toBeDefined();
    });
  });

  describe('Use Case', () => {
    it('should call run method and return a all users', async () => {
      const repositorySpy = jest.spyOn(userRepository, 'findAll');

      const resp = await findAllUsersUseCase.run();

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(paginatedUsersMock);
    });

    it('should throw an error when the repository throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(userRepository, 'findAll').mockRejectedValue(errorMock);

      await expect(findAllUsersUseCase.run()).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM051,
        }),
      );
    });
  });
});

import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { DeleteUserUseCase } from '@modules/users/application';
import {
  userErrorsCodes,
  UserProvidersEnum,
  UserRepositoryInterface,
} from '@modules/users/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { internalServerErrorExceptionMock, userMock } from '@test/mocks';

describe('DeleteUserUseCase', () => {
  const context = 'DeleteUserUseCase';
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserProvidersEnum.USER_REPOSITORY,
          useValue: {
            delete: jest.fn().mockReturnValue(userMock),
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
          provide: DeleteUserUseCase,
          useFactory: (
            userRepository: UserRepositoryInterface,
            loggerService: LoggerServiceInterface,
            exceptionService: ExceptionServiceInterface,
          ) =>
            new DeleteUserUseCase(
              userRepository,
              loggerService,
              exceptionService,
            ),
        },
      ],
    }).compile();

    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = module.get<UserRepositoryInterface>(
      UserProvidersEnum.USER_REPOSITORY,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(deleteUserUseCase).toBeDefined();
      expect(userRepository).toBeDefined();
    });
  });

  describe('Use Case', () => {
    it('should call run method and return a deleted user', async () => {
      const repositorySpy = jest.spyOn(userRepository, 'delete');

      const resp = await deleteUserUseCase.run(userMock.id);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock);
    });

    it('should throw an error when the repository throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(userRepository, 'delete').mockRejectedValue(errorMock);

      await expect(deleteUserUseCase.run(userMock.id)).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM051,
        }),
      );
    });
  });
});

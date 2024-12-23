import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { UpdateUserUseCase } from '@modules/users/application';
import {
  userErrorsCodes,
  UserProvidersEnum,
  UserRepositoryInterface,
} from '@modules/users/domain';
import { Test, TestingModule } from '@nestjs/testing';
import {
  fieldsToUpdateUser,
  internalServerErrorExceptionMock,
  userMock,
  userUpdatedMock,
} from '@test/mocks';

describe('UpdateUserUseCase', () => {
  const context = 'UpdateUserUseCase';
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserProvidersEnum.USER_REPOSITORY,
          useValue: {
            update: jest.fn().mockReturnValue(userUpdatedMock),
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
                message: userErrorsCodes.UM041,
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
          provide: UpdateUserUseCase,
          useFactory: (
            userRepository: UserRepositoryInterface,
            loggerService: LoggerServiceInterface,
            exceptionService: ExceptionServiceInterface,
          ) =>
            new UpdateUserUseCase(
              userRepository,
              loggerService,
              exceptionService,
            ),
        },
      ],
    }).compile();

    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = module.get<UserRepositoryInterface>(
      UserProvidersEnum.USER_REPOSITORY,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(updateUserUseCase).toBeDefined();
      expect(userRepository).toBeDefined();
    });
  });

  describe('Use Case', () => {
    it('should call run method and return an updated user', async () => {
      const repositorySpy = jest.spyOn(userRepository, 'update');

      const resp = await updateUserUseCase.run(userMock.id, fieldsToUpdateUser);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userUpdatedMock);
    });

    it('should throw an error when the repository throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(userRepository, 'update').mockRejectedValue(errorMock);

      await expect(
        updateUserUseCase.run(userMock.id, fieldsToUpdateUser),
      ).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM041,
        }),
      );
    });
  });
});

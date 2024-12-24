import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionProvidersEnum } from '@common/adapters/exception/domain';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import { userErrorsCodes, UserProvidersEnum } from '@modules/users/domain';
import { DeleteUserUseCase } from '@modules/users/application';
import {
  DeleteUserController,
  UserPresenter,
} from '@modules/users/infrastructure';
import { userMock, internalServerErrorExceptionMock } from '@test/mocks';

describe('DeleteUserController', () => {
  const context = 'DeleteUserController';
  let deleteUserController: DeleteUserController;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: UserProvidersEnum.DELETE_USER_USE_CASE,
          useValue: {
            run: jest.fn().mockResolvedValue(userMock),
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
                message: userErrorsCodes.UM052,
              });
            }),
          },
        },
      ],
    }).compile();

    deleteUserController =
      module.get<DeleteUserController>(DeleteUserController);
    deleteUserUseCase = module.get<DeleteUserUseCase>(
      UserProvidersEnum.DELETE_USER_USE_CASE,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(deleteUserController).toBeDefined();
      expect(deleteUserUseCase).toBeDefined();
    });
  });

  describe('Controller', () => {
    it('should call run method and return a deleted user', async () => {
      const useCaseSpy = jest.spyOn(deleteUserUseCase, 'run');

      const resp = await deleteUserController.run(userMock.id);

      expect(resp).toEqual(new UserPresenter(userMock));
      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the use case throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(deleteUserUseCase, 'run').mockRejectedValue(errorMock);

      const resp = deleteUserController.run(userMock.id);

      const throwMock = internalServerErrorExceptionMock({
        context,
        message: userErrorsCodes.UM052,
      });

      await expect(resp).rejects.toThrow(throwMock);
    });
  });
});

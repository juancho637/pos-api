import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionProvidersEnum } from '@common/adapters/exception/domain';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import { userErrorsCodes, UserProvidersEnum } from '@modules/users/domain';
import { UpdateUserUseCase } from '@modules/users/application';
import {
  UpdateUserController,
  UserPresenter,
} from '@modules/users/infrastructure';
import { UpdateUserDto } from '@modules/users/infrastructure/dto';
import { internalServerErrorExceptionMock, userUpdatedMock } from '@test/mocks';

describe('UpdateUserController', () => {
  const context = 'UpdateUserController';
  let updateUserController: UpdateUserController;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [
        {
          provide: UserProvidersEnum.UPDATE_USER_USE_CASE,
          useValue: {
            run: jest.fn().mockResolvedValue(userUpdatedMock),
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
                message: userErrorsCodes.UM042,
              });
            }),
          },
        },
      ],
    }).compile();

    updateUserController =
      module.get<UpdateUserController>(UpdateUserController);
    updateUserUseCase = module.get<UpdateUserUseCase>(
      UserProvidersEnum.UPDATE_USER_USE_CASE,
    );
  });

  describe('Is defined', () => {
    it('should be defined', () => {
      expect(updateUserController).toBeDefined();
      expect(updateUserUseCase).toBeDefined();
    });
  });

  describe('Controller', () => {
    it('should call run method and return the updated user', async () => {
      const useCaseSpy = jest.spyOn(updateUserUseCase, 'run');
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newsecurepassword',
      };

      const resp = await updateUserController.run(id, updateUserDto);

      expect(resp).toEqual(new UserPresenter(userUpdatedMock));
      expect(useCaseSpy).toHaveBeenCalledWith(id, updateUserDto);
      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the use case throws an error', async () => {
      const errorMock = new Error('Something went wrong');
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      jest.spyOn(updateUserUseCase, 'run').mockRejectedValue(errorMock);

      const resp = updateUserController.run(id, updateUserDto);

      const throwMock = internalServerErrorExceptionMock({
        context,
        message: userErrorsCodes.UM042,
      });

      await expect(resp).rejects.toThrow(throwMock);
    });
  });
});

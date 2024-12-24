import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionProvidersEnum } from '@common/adapters/exception/domain';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import { userErrorsCodes, UserProvidersEnum } from '@modules/users/domain';
import { StoreUserUseCase } from '@modules/users/application';
import {
  StoreUserController,
  UserPresenter,
} from '@modules/users/infrastructure';
import {
  createUserDtoMock,
  internalServerErrorExceptionMock,
  userMock,
} from '@test/mocks';

describe('StoreUserController', () => {
  const context = 'StoreUserController';
  let storeUserController: StoreUserController;
  let storeUserUseCase: StoreUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreUserController],
      providers: [
        {
          provide: UserProvidersEnum.STORE_USER_USE_CASE,
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
                message: userErrorsCodes.UM032,
              });
            }),
          },
        },
      ],
    }).compile();

    storeUserController = module.get<StoreUserController>(StoreUserController);
    storeUserUseCase = module.get<StoreUserUseCase>(
      UserProvidersEnum.STORE_USER_USE_CASE,
    );
  });

  describe('Is defined', () => {
    it('should be defined', () => {
      expect(storeUserController).toBeDefined();
      expect(storeUserUseCase).toBeDefined();
    });
  });

  describe('Controller', () => {
    it('should call run method and return the created user', async () => {
      const useCaseSpy = jest.spyOn(storeUserUseCase, 'run');

      const resp = await storeUserController.run(createUserDtoMock);

      expect(resp).toEqual(new UserPresenter(userMock));
      expect(useCaseSpy).toHaveBeenCalledWith(createUserDtoMock);
      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the use case throws an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(storeUserUseCase, 'run').mockRejectedValue(errorMock);

      await expect(storeUserController.run(createUserDtoMock)).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM032,
        }),
      );
    });

    it('should throw an error when the use case throws an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(storeUserUseCase, 'run').mockRejectedValue(errorMock);

      const resp = storeUserController.run(createUserDtoMock);

      const throwMock = internalServerErrorExceptionMock({
        context,
        message: userErrorsCodes.UM032,
      });

      await expect(resp).rejects.toThrow(throwMock);
    });

    // it('should throw a BadRequestException if DTO validation fails (missing required fields)', async () => {
    //   await expect(
    //     storeUserController.run(createUserDtoMockTofailWithEmptyFields),
    //   ).rejects.toThrow(BadRequestException);
    // });

    // it('should throw a BadRequestException if both rolesIds and permissionsIds are empty', async () => {
    //   await expect(
    //     storeUserController.run(
    //       createUserDtoMockTofailWithoutRolesAndPermissions,
    //     ),
    //   ).rejects.toThrow(BadRequestException);
    // });
  });
});

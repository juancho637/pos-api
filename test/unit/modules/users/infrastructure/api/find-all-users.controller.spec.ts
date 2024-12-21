import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionProvidersEnum } from '@common/adapters/exception/domain';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import {
  userErrorsCodes,
  UserProvidersEnum,
  UserType,
} from '@modules/users/domain';
import { FindAllUsersUseCase } from '@modules/users/application';
import {
  FindAllUsersController,
  UserPresenter,
} from '@modules/users/infrastructure';
import {
  internalServerErrorExceptionMock,
  paginatedUsersMock,
} from '@test/mocks';
import { paginatedResourceHelper } from '@common/helpers/application';

describe('FindAllUsersController', () => {
  const context = 'FindAllUsersController';
  let findAllUsersController: FindAllUsersController;
  let findAllUsersUseCase: FindAllUsersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindAllUsersController],
      providers: [
        {
          provide: UserProvidersEnum.FIND_ALL_USERS_USE_CASE,
          useValue: {
            run: jest.fn().mockResolvedValue(paginatedUsersMock),
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
                message: userErrorsCodes.UM022,
              });
            }),
          },
        },
      ],
    }).compile();

    findAllUsersController = module.get<FindAllUsersController>(
      FindAllUsersController,
    );
    findAllUsersUseCase = module.get<FindAllUsersUseCase>(
      UserProvidersEnum.FIND_ALL_USERS_USE_CASE,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(findAllUsersController).toBeDefined();
      expect(findAllUsersUseCase).toBeDefined();
    });
  });

  describe('Controller', () => {
    it('should call run method and return all users', async () => {
      const useCaseSpy = jest.spyOn(findAllUsersUseCase, 'run');

      const resp = await findAllUsersController.run();

      expect(resp).toEqual(
        paginatedResourceHelper<UserType, UserPresenter>(
          paginatedUsersMock,
          UserPresenter,
        ),
      );
      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the use case throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(findAllUsersUseCase, 'run').mockRejectedValue(errorMock);

      await expect(findAllUsersController.run()).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM022,
        }),
      );
    });
  });
});

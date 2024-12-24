import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionProvidersEnum } from '@common/adapters/exception/domain';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import { userErrorsCodes, UserProvidersEnum } from '@modules/users/domain';
import { FindByUserUseCase } from '@modules/users/application';
import {
  FindByUserController,
  UserPresenter,
} from '@modules/users/infrastructure';
import { FilterRuleEnum } from '@common/helpers/domain';
import { internalServerErrorExceptionMock, userMock } from '@test/mocks';

describe('FindByUserController', () => {
  const context = 'FindByUserController';
  let findByUserController: FindByUserController;
  let findByUserUseCase: FindByUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindByUserController],
      providers: [
        {
          provide: UserProvidersEnum.FIND_BY_USER_USE_CASE,
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
                message: userErrorsCodes.UM012,
              });
            }),
          },
        },
      ],
    }).compile();

    findByUserController =
      module.get<FindByUserController>(FindByUserController);
    findByUserUseCase = module.get<FindByUserUseCase>(
      UserProvidersEnum.FIND_BY_USER_USE_CASE,
    );
  });

  describe('Is defined', () => {
    it('should be defined', () => {
      expect(findByUserController).toBeDefined();
      expect(findByUserUseCase).toBeDefined();
    });
  });

  describe('Controller', () => {
    it('should call run method and return the user', async () => {
      const useCaseSpy = jest.spyOn(findByUserUseCase, 'run');
      const id = 1;

      const resp = await findByUserController.run(id);

      const calledWith = {
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      };

      expect(resp).toEqual(new UserPresenter(userMock));
      expect(useCaseSpy).toHaveBeenCalledWith(calledWith);
      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the use case throws an error', async () => {
      const errorMock = new Error('Something went wrong');
      const id = 1;

      jest.spyOn(findByUserUseCase, 'run').mockRejectedValue(errorMock);

      const resp = findByUserController.run(id);

      const throwMock = internalServerErrorExceptionMock({
        context,
        message: userErrorsCodes.UM012,
      });

      await expect(resp).rejects.toThrow(throwMock);
    });
  });
});

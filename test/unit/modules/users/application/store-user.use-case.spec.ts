import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  HashProvidersEnum,
  HashServiceInterface,
} from '@common/adapters/hash/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { FindAllPermissionsUseCase } from '@modules/permissions/application';
import { PermissionProvidersEnum } from '@modules/permissions/domain';
import { FindAllRolesUseCase } from '@modules/roles/application';
import { RoleProvidersEnum } from '@modules/roles/domain';
import { StoreUserUseCase } from '@modules/users/application';
import {
  userErrorsCodes,
  UserProvidersEnum,
  UserRepositoryInterface,
} from '@modules/users/domain';
import { Test, TestingModule } from '@nestjs/testing';
import {
  fieldsToCreateUser,
  internalServerErrorExceptionMock,
  userMock,
} from '@test/mocks';

describe('StoreUserUseCase', () => {
  const context = 'StoreUserUseCase';
  let storeUserUseCase: StoreUserUseCase;
  let userRepository: UserRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserProvidersEnum.USER_REPOSITORY,
          useValue: {
            store: jest.fn().mockReturnValue(userMock),
          },
        },
        {
          provide: RoleProvidersEnum.FIND_ALL_ROLES_USE_CASE,
          useValue: {
            run: jest.fn().mockResolvedValue({
              items: [
                { id: 1, name: 'Admin' },
                { id: 2, name: 'User' },
              ],
            }),
          },
        },
        {
          provide: PermissionProvidersEnum.FIND_ALL_PERMISSIONS_USE_CASE,
          useValue: {
            run: jest.fn().mockResolvedValue({
              items: [
                { id: 1, name: 'Read' },
                { id: 2, name: 'Write' },
              ],
            }),
          },
        },
        {
          provide: HashProvidersEnum.HASH_SERVICE,
          useValue: {
            hash: jest.fn(),
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
                message: userErrorsCodes.UM031,
              });
            }),
          },
        },
        {
          inject: [
            UserProvidersEnum.USER_REPOSITORY,
            RoleProvidersEnum.FIND_ALL_ROLES_USE_CASE,
            PermissionProvidersEnum.FIND_ALL_PERMISSIONS_USE_CASE,
            HashProvidersEnum.HASH_SERVICE,
            LoggerProvidersEnum.LOGGER_SERVICE,
            ExceptionProvidersEnum.EXCEPTION_SERVICE,
          ],
          provide: StoreUserUseCase,
          useFactory: (
            userRepository: UserRepositoryInterface,
            findAllRolesUseCase: FindAllRolesUseCase,
            findAllPermissionsUseCase: FindAllPermissionsUseCase,
            hashService: HashServiceInterface,
            loggerService: LoggerServiceInterface,
            exceptionService: ExceptionServiceInterface,
          ) =>
            new StoreUserUseCase(
              userRepository,
              findAllRolesUseCase,
              findAllPermissionsUseCase,
              hashService,
              loggerService,
              exceptionService,
            ),
        },
      ],
    }).compile();

    storeUserUseCase = module.get<StoreUserUseCase>(StoreUserUseCase);
    userRepository = module.get<UserRepositoryInterface>(
      UserProvidersEnum.USER_REPOSITORY,
    );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(storeUserUseCase).toBeDefined();
      expect(userRepository).toBeDefined();
    });
  });

  describe('Use Case', () => {
    it('should call run method and return a stored user', async () => {
      const repositorySpy = jest.spyOn(userRepository, 'store');

      const resp = await storeUserUseCase.run(fieldsToCreateUser);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock);
    });

    it('should throw an error when the repository throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest.spyOn(userRepository, 'store').mockRejectedValue(errorMock);

      await expect(storeUserUseCase.run(fieldsToCreateUser)).rejects.toThrow(
        internalServerErrorExceptionMock({
          context,
          message: userErrorsCodes.UM031,
        }),
      );
    });
  });
});

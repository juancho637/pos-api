import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserEntity,
  UserTypeOrmRepository,
} from '@modules/users/infrastructure';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  // ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  fieldsToCreateUser,
  fieldsToUpdateUser,
  findAndCountUsersMock,
  // internalServerErrorExceptionMock,
  paginatedUsersMock,
  userCreatedMock,
  userMock,
  userUpdatedMock,
} from '@test/mocks';
// import { userErrorsCodes } from '@modules/users/domain';
import { FilterRuleEnum } from '@common/helpers/domain';

describe('UserTypeOrmRepository', () => {
  // const context = UserTypeOrmRepository.name;
  let userTypeOrmRepository: UserTypeOrmRepository;
  let userTypeOrmRepositoryMock: Repository<UserEntity>;
  // let exceptionServiceMock: ExceptionServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
              return 'Internal server error';
            }),
          },
        },
        UserTypeOrmRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockReturnValue(userMock),
            findAndCount: jest.fn().mockReturnValue(findAndCountUsersMock),
            save: jest.fn(),
            softRemove: jest.fn().mockReturnValue(userMock),
          },
        },
      ],
    }).compile();

    userTypeOrmRepository = module.get<UserTypeOrmRepository>(
      UserTypeOrmRepository,
    );
    userTypeOrmRepositoryMock = module.get(getRepositoryToken(UserEntity));
    // exceptionServiceMock = module.get<ExceptionServiceInterface>(
    //   ExceptionProvidersEnum.EXCEPTION_SERVICE,
    // );
  });

  describe('Is defined', () => {
    it('defined', () => {
      expect(userTypeOrmRepository).toBeDefined();
      expect(userTypeOrmRepositoryMock).toBeDefined();
    });
  });

  describe('findOneBy method', () => {
    it('should call findOneBy method and return a user by id', async () => {
      const repositorySpy = jest.spyOn(userTypeOrmRepositoryMock, 'findOne');
      const { id } = userMock as UserEntity;

      const resp = await userTypeOrmRepository.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock as UserEntity);
    });

    it('should throw an error when the database throw an error', async () => {
      const errorMock = new Error('Something went wrong');

      jest
        .spyOn(userTypeOrmRepositoryMock, 'findOne')
        .mockRejectedValue(errorMock);

      const resp = await userTypeOrmRepository.findOneBy({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: userMock.id,
        },
      });

      console.log('resp', resp);

      expect(resp).rejects.toThrow();
    });
  });

  describe('findAll method', () => {
    const pagination = {
      page: 1,
      size: 10,
    };

    it('should call findAll method and return all users', async () => {
      const repositorySpy = jest.spyOn(
        userTypeOrmRepositoryMock,
        'findAndCount',
      );

      const resp = await userTypeOrmRepository.findAll({ pagination });

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(paginatedUsersMock);
    });

    // it('should throw an error when the database throw an error', async () => {
    //   const errorMock = new Error('Something went wrong');

    //   jest
    //     .spyOn(userTypeOrmRepositoryMock, 'findAndCount')
    //     .mockRejectedValue(errorMock);

    //   await expect(
    //     userTypeOrmRepository.findAll({ pagination }),
    //   ).rejects.toThrow(
    //     internalServerErrorExceptionMock(context, userErrorsCodes.UM020),
    //   );
    // });
  });

  describe('store method', () => {
    it('should call store method and return a stored user', async () => {
      const repositorySpy = jest
        .spyOn(userTypeOrmRepositoryMock, 'save')
        .mockResolvedValue(userCreatedMock);

      const resp = await userTypeOrmRepository.store(fieldsToCreateUser);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userCreatedMock);
    });

    // it('should throw an error when the database throw an error', async () => {
    //   const errorMock = new Error('Something went wrong');

    //   jest
    //     .spyOn(userTypeOrmRepositoryMock, 'save')
    //     .mockRejectedValue(errorMock);

    //   await expect(
    //     userTypeOrmRepository.store(fieldsToCreateUser),
    //   ).rejects.toThrow(
    //     internalServerErrorExceptionMock(context, userErrorsCodes.UM030),
    //   );
    // });
  });

  describe('update method', () => {
    it('should call update method and return a updated user', async () => {
      const repositorySpy = jest
        .spyOn(userTypeOrmRepositoryMock, 'save')
        .mockResolvedValue(userUpdatedMock as UserEntity);

      const resp = await userTypeOrmRepository.update(
        userMock.id,
        fieldsToUpdateUser,
      );

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userUpdatedMock);
    });

    // it('should throw an error when the database throw an error', async () => {
    //   const errorMock = new Error('Something went wrong');

    //   jest
    //     .spyOn(userTypeOrmRepositoryMock, 'save')
    //     .mockRejectedValue(errorMock);

    //   await expect(
    //     userTypeOrmRepository.update(userMock.id, fieldsToUpdateUser),
    //   ).rejects.toThrow(
    //     internalServerErrorExceptionMock(context, userErrorsCodes.UM040),
    //   );
    // });
  });

  describe('delete method', () => {
    it('should call delete method and return a deleted user', async () => {
      const repositorySpy = jest.spyOn(userTypeOrmRepositoryMock, 'softRemove');

      const resp = await userTypeOrmRepository.delete(userMock.id);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock);
    });

    // it('should throw an error when the database throw an error', async () => {
    //   const errorMock = new Error('Something went wrong');

    //   jest
    //     .spyOn(userTypeOrmRepositoryMock, 'softRemove')
    //     .mockRejectedValue(errorMock);

    //   await expect(userTypeOrmRepository.delete(userMock.id)).rejects.toThrow(
    //     internalServerErrorExceptionMock(context, userErrorsCodes.UM050),
    //   );
    // });
  });
});

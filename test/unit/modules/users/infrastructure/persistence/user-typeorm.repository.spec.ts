import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserEntity,
  UserTypeOrmRepository,
} from '@modules/users/infrastructure';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import { ExceptionProvidersEnum } from '@common/adapters/exception/domain';
import {
  errorMock,
  fieldsToCreateUserRepository,
  fieldsToUpdateUser,
  findAndCountUsersMock,
  paginatedUsersMock,
  userCreatedMock,
  userMock,
  userUpdatedMock,
} from '@test/mocks';
import { FilterRuleEnum } from '@common/helpers/domain';
import { UserType } from '@modules/users/domain';

describe('UserTypeOrmRepository', () => {
  let userTypeOrmRepository: UserTypeOrmRepository;
  let userTypeOrmRepositoryMock: Repository<UserType | UserType[]>;

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
              throw errorMock;
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
      const { id } = userMock;

      const resp = await userTypeOrmRepository.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock);
    });

    it('should throw an error when the database throw an error', async () => {
      jest
        .spyOn(userTypeOrmRepositoryMock, 'findOne')
        .mockRejectedValue(errorMock);

      const resp = userTypeOrmRepository.findOneBy({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: userMock.id,
        },
      });

      await expect(resp).rejects.toThrow(errorMock);
    });
  });

  describe('findAll method', () => {
    it('should call findAll method and return all users', async () => {
      const repositorySpy = jest.spyOn(
        userTypeOrmRepositoryMock,
        'findAndCount',
      );

      const resp = await userTypeOrmRepository.findAll();

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(paginatedUsersMock);
    });

    it('should throw an error when the database throw an error', async () => {
      jest
        .spyOn(userTypeOrmRepositoryMock, 'findAndCount')
        .mockRejectedValue(errorMock);

      const resp = userTypeOrmRepository.findAll();

      await expect(resp).rejects.toThrow(errorMock);
    });
  });

  describe('store method', () => {
    it('should call store method and return a stored user', async () => {
      const repositorySpy = jest
        .spyOn(userTypeOrmRepositoryMock, 'save')
        .mockResolvedValue(userCreatedMock);

      const resp = await userTypeOrmRepository.store(
        fieldsToCreateUserRepository,
      );

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userCreatedMock);
    });

    it('should call store method and return a stored users', async () => {
      const repositorySpy = jest
        .spyOn(userTypeOrmRepositoryMock, 'save')
        .mockResolvedValue([userCreatedMock]);

      const resp = await userTypeOrmRepository.store([
        fieldsToCreateUserRepository,
      ]);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual([userCreatedMock]);
    });

    it('should throw an error when the database throw an error', async () => {
      jest
        .spyOn(userTypeOrmRepositoryMock, 'save')
        .mockRejectedValue(errorMock);

      const resp = userTypeOrmRepository.store(fieldsToCreateUserRepository);

      await expect(resp).rejects.toThrow(errorMock);
    });
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

    it('should throw an error when the database throw an error', async () => {
      jest
        .spyOn(userTypeOrmRepositoryMock, 'save')
        .mockRejectedValue(errorMock);

      const resp = userTypeOrmRepository.update(
        userMock.id,
        fieldsToUpdateUser,
      );

      await expect(resp).rejects.toThrow(errorMock);
    });
  });

  describe('delete method', () => {
    it('should call delete method and return a deleted user', async () => {
      const repositorySpy = jest.spyOn(userTypeOrmRepositoryMock, 'softRemove');

      const resp = await userTypeOrmRepository.delete(userMock.id);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(resp).toEqual(userMock);
    });

    it('should throw an error when the database throw an error', async () => {
      jest
        .spyOn(userTypeOrmRepositoryMock, 'softRemove')
        .mockRejectedValue(errorMock);

      const resp = userTypeOrmRepository.delete(userMock.id);

      await expect(resp).rejects.toThrow(errorMock);
    });
  });
});

import { DeepPartial, Repository } from 'typeorm';
import { Account } from '../entities/Account';
import { AccountService } from './accountService';

const mockAccountRepository = {
  create: jest.fn((account) => account),
  save: jest.fn((account) => Promise.resolve(account)),
  findOne: jest.fn(),
} as unknown as Repository<Account>;

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(() => {
    accountService = new AccountService(mockAccountRepository as Repository<Account>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createAccount - should create an account', async () => {
    const userData = {
      userEmail: 'test@example.com',
    };

    const result = await accountService.createAccount(userData);

    expect(result).toBeDefined();
    expect(result?.userEmail).toBe(userData.userEmail);
    expect(mockAccountRepository.create).toHaveBeenCalledWith(userData);
    expect(mockAccountRepository.save).toHaveBeenCalledWith(result);
  });

  it('getAccount - should get an account', async () => {
    const userEmail = 'test@example.com';
    const mockAccount: Account = {
      id: 1,
      userEmail,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
      setEmailToLowerCase: () => {},
    };

    jest.spyOn(mockAccountRepository, 'findOne').mockResolvedValue(mockAccount);

    const result = await accountService.getAccount(userEmail);

    expect(result).toEqual(mockAccount);
    expect(mockAccountRepository.findOne).toHaveBeenCalledWith({ where: { userEmail }, relations: ['transactions'] });
  });
});

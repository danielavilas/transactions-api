import { Repository } from 'typeorm';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';
import { TransactionService } from './transactionService';

const queryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  manager: {
    findOne: jest.fn(),
    increment: jest.fn(),
    save: jest.fn(),
  },
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
};

const mockAccountRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  manager: {
    connection: {
      createQueryRunner: jest.fn(() => queryRunner),
    },
  },
} as unknown as Repository<Account>;

const mockTransactionRepository = {
  find: jest.fn(),
  save: jest.fn(),
} as unknown as Repository<Transaction>;

const transactionService = new TransactionService(
  mockAccountRepository,
  mockTransactionRepository
);

describe('TransactionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should return transactions', async () => {
      const mockTransactions: Partial<Transaction>[] = [
        { id: 1, userEmail: 'test@example.com', amount: 100, type: 'receive', createdAt: new Date() },
        { id: 2, userEmail: 'test@example.com', amount: 50, type: 'send', createdAt: new Date() },
      ];

      (mockTransactionRepository.find as jest.Mock).mockResolvedValueOnce(mockTransactions);

      const transactions = await transactionService.getTransactions({ page: 1, pageSize: 10 });

      expect(mockTransactionRepository.find).toHaveBeenCalledTimes(1);

      expect(transactions).toEqual(mockTransactions);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const userEmail = 'test@example.com';
      const amount = 100;
      const type = 'receive';

      const mockAccount: Account = {
        id: 1,
        userEmail,
        balance: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
        transactions: [],
        setEmailToLowerCase: () => {},
      };

      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue(mockAccount);

      await transactionService.createTransaction(userEmail, amount, type);

      expect(queryRunner.manager.findOne).toHaveBeenCalledTimes(2);
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(
        Account,
        { where: { userEmail }, lock: { mode: 'pessimistic_write' } }
      );
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(
        Account,
        { where: { id: 1 }, lock: { mode: 'pessimistic_write' } }
      );
      expect(queryRunner.manager.increment).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(2);
      expect(mockAccountRepository.manager.connection.createQueryRunner().commitTransaction).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when account is not found', async () => {
      const userEmail = 'test@example.com';
      const amount = 100;
      const type = 'receive';

      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(null);

      await expect(transactionService.createTransaction(userEmail, amount, type))
        .rejects.toThrow('Account with email test@example.com not found');

      expect(queryRunner.manager.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when balance is insufficient', async () => {
      const userEmail = 'test@example.com';
      const amount = 100;
      const type = 'receive';

      jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue({
        id: 1,
        balance: -10,
      });

      await expect(transactionService.createTransaction(userEmail, amount, type))
        .rejects.toThrow('Insufficient funds for this transaction');

      expect(queryRunner.manager.findOne).toHaveBeenCalledTimes(2);
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(
        Account,
        { where: { userEmail }, lock: { mode: 'pessimistic_write' } }
      );
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(
        Account,
        { where: { id: 1 }, lock: { mode: 'pessimistic_write' } }
      );
    });
  });
});

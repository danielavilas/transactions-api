import { Between, LessThanOrEqual, MoreThanOrEqual, Repository, Equal } from 'typeorm';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';

type GetTransactionParams = {
  page: number,
  pageSize: number,
  from?: Date,
  to?: Date,
  userEmail?: string,
  type?: 'receive' | 'send',
};

export class TransactionService {
  private accountRepository: Repository<Account>;
  private transactionRepository: Repository<Transaction>;

  constructor(
    accountRepository: Repository<Account>,
    transactionRepository: Repository<Transaction>
  ) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  async getTransactions({
    page,
    pageSize,
    from,
    to,
    userEmail,
    type,
  }: GetTransactionParams): Promise<{
    transactions: Transaction[],
    totalItems: number,
    totalPages: number,
  }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const where: any = {};

    if (userEmail) {
      where.userEmail = userEmail;
    }

    if (type) {
      where.type = type;
    }
    
    if (from && to) {
      where.createdAt = Between(from, to);
    } else if (from) {
      where.createdAt = MoreThanOrEqual(from);
    } else if (to) {
      where.createdAt = LessThanOrEqual(to);
    }

    const [transactions, totalItems] = await this.transactionRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC'
      },
      skip: offset,
      take: limit
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      transactions,
      totalItems,
      totalPages,
    };
  }

  async createTransaction(userEmail: string, amount: number, type: 'send' | 'receive'): Promise<Transaction | null> {
    const queryRunner = this.accountRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const account = await queryRunner.manager.findOne(Account, {
        where: { userEmail },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Account with email ${userEmail} not found`);
      }

      const adjustment = type === 'receive' ? amount : -amount;

      await queryRunner.manager.increment(Account, { id: account.id }, 'balance', adjustment);

      const updatedAccount = await queryRunner.manager.findOne(Account, {
        where: { id: account.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!updatedAccount || updatedAccount.balance < 0) {
        await queryRunner.rollbackTransaction();
        throw new Error('Insufficient funds for this transaction');
      }

      const transaction = new Transaction();
      transaction.userEmail = userEmail;
      transaction.amount = amount;
      transaction.type = type;
      transaction.account = updatedAccount;

      updatedAccount.updatedAt = new Date();

      await Promise.all([
        queryRunner.manager.save(transaction),
        queryRunner.manager.save(updatedAccount),
      ]);

      await queryRunner.commitTransaction();

      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

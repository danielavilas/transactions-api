import { Repository } from 'typeorm';
import { Account } from '../entities/Account';

export class AccountService {
  private accountRepository: Repository<Account>;

  constructor(accountRepository: Repository<Account>) {
    this.accountRepository = accountRepository;
  }

  async createAccount({
    userEmail
  }: {
    userEmail: string
  }): Promise<Account | null> {
    const account = this.accountRepository.create({
      userEmail,
    });

    return await this.accountRepository.save(account);
  }

  async getAccount(userEmail: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ where: { userEmail }, relations: ['transactions'] });

    return account;
  }
}

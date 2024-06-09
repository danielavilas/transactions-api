import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../db';
import { AccountService } from '../services/accountService';
import { Account } from '../entities/Account';

const accountRepository = AppDataSource.getRepository(Account);
const accountService = new AccountService(accountRepository);

interface GetAccountParams {
  userEmail: string;
}

interface CreateAccountBody {
  userEmail: string;
}

export const getAccount = async (
  request: FastifyRequest<{ Params: GetAccountParams }>,
  reply: FastifyReply
) => {
  const { userEmail } = request.params;

  const account = await accountService.getAccount(userEmail);

  if (account) {
    reply.send(account);
  } else {
    reply.status(404).send({ error: 'Account not found' });
  }
};

export const createAccount = async (
  request: FastifyRequest<{ Body: CreateAccountBody }>,
  reply: FastifyReply
) => {
  const { userEmail } = request.body;
  const account = await accountService.createAccount({
    userEmail
  });

  if (account) {
    reply.send(account);
  } else {
    reply.status(404).send({ error: 'Account not found' });
  }
};

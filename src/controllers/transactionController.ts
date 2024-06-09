import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../db';
import { TransactionService } from '../services/transactionService';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';

const accountRepository = AppDataSource.getRepository(Account);
const transactionRepository = AppDataSource.getRepository(Transaction);
const transactionService = new TransactionService(accountRepository, transactionRepository);

type CreateTransactionBody = { userEmail: string; amount: number; type: 'send' | 'receive' };
type GetTransactionsParams = { userEmail?: string, page?: number, pageSize?: number, from?: Date, to?: Date, type?: 'send' | 'receive' };

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: GetTransactionsParams }>,
  reply: FastifyReply,
) => {
  const {
    page = 1,
    pageSize = 50,
    from,
    to,
    userEmail,
    type,
  } = request.query;

  try {
    const { transactions, totalItems, totalPages } = await transactionService.getTransactions({
      page,
      pageSize,
      from,
      to,
      userEmail,
      type,
    });

    reply.status(200).send({
      transactions,
      page,
      pageSize,
      totalPages,
      totalItems,
    });
  } catch (err) {
    reply.status(500).send({ error: 'Transaction failed' });
  }
};

export const createTransaction = async (
  request: FastifyRequest<{ Body: CreateTransactionBody }>,
  reply: FastifyReply,
) => {
  const { userEmail, amount, type } = request.body;

  try {
    const transaction = await transactionService.createTransaction(userEmail, amount, type);

    if (!transaction) {
      return reply.status(400).send({ error: 'Insufficient balance or account not found' });
    }

    reply.status(201).send({ transaction });
  } catch (err) {
    reply.status(500).send({ error: 'Transaction failed' });
  }
};

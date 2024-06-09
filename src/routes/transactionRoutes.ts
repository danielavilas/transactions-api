import { FastifyInstance } from 'fastify';
import { createTransaction, getTransactions } from '../controllers/transactionController';
import { getTransactionsSchema, createTransactionSchema } from './schemas';

export const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/api/v1/transactions', { schema: getTransactionsSchema }, getTransactions);
  fastify.post('/api/v1/transactions', { schema: createTransactionSchema }, createTransaction);
};

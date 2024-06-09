import { FastifyInstance } from 'fastify';
import { createAccount, getAccount } from '../controllers/accountController';
import { getAccountSchema, createAccountSchema } from './schemas';

export const accountRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/api/v1/accounts/:userEmail', { schema: getAccountSchema }, getAccount);
  fastify.post('/api/v1/accounts', { schema: createAccountSchema }, createAccount);
};

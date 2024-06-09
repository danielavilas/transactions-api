import { FastifySchema } from 'fastify';

export const getTransactionsSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      userEmail: { type: 'string', format: 'email' },
      page: { type: 'integer', minimum: 1 },
      pageSize: { type: 'integer', minimum: 1 },
      from: { type: 'string', format: 'date-time' },
      to: { type: 'string', format: 'date-time' },
      type: { type: 'string', enum: ['receive', 'send'] }
    },
  },
};

export const createTransactionSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['userEmail', 'amount', 'type'],
    properties: {
      userEmail: { type: 'string', format: 'email' },
      amount: {
        type: 'number',
        minimum: 0.01,
        multipleOf: 0.001
      },
      type: { type: 'string', enum: ['receive', 'send'] }
    }
  }
};

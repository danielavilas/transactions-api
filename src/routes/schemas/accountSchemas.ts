import { FastifySchema } from 'fastify';

export const createAccountSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['userEmail'],
    properties: {
      userEmail: { type: 'string', format: 'email' }
    }
  }
};

export const getAccountSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['userEmail'],
    properties: {
      userEmail: { type: 'string', format: 'email' }
    }
  }
};

import 'reflect-metadata';
import Fastify from 'fastify';
import * as dotenv from 'dotenv';

dotenv.config();

import { initializeDatabase } from './db';
import { accountRoutes } from './routes/accountRoutes';
import { transactionRoutes } from './routes/transactionRoutes';

const app = Fastify();

const start = async () => {
  try {
    await initializeDatabase();

    app.register(accountRoutes);
    app.register(transactionRoutes);

    app.get('/', (_, reply) => {
      reply.send({ good: true })
    })

    const address = await app.listen({ port: 8080 });

    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

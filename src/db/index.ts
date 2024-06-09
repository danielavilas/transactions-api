import { DataSource } from 'typeorm';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Account, Transaction],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  await AppDataSource.initialize();
  console.log('Data Source has been initialized!');
};

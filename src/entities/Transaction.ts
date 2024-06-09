import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  BeforeInsert
} from 'typeorm';
import { Account } from './Account';

export type TransactionType = 'send' | 'receive';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userEmail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['send', 'receive'] })
  type: TransactionType;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Account, account => account.transactions)
  account: Account;

  @BeforeInsert()
  setEmailToLowerCase() {
    this.userEmail = this.userEmail.toLowerCase();
  }
}

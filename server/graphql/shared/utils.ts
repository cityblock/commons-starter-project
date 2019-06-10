import { Transaction } from 'objection';

export interface IContext {
  testTransaction?: Transaction;
  getOrCreateTransaction: <T>(
    testTransaction: Transaction | undefined,
    cb: (txn: Transaction) => Promise<T>,
  ) => Promise<T>;
  ipAddress: string;
}

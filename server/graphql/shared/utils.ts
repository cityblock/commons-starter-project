import { transaction, Model, Transaction } from 'objection';

export interface IContext {
  testTransaction?: Transaction;
  getOrCreateTransaction: <T>(
    testTransaction: Transaction | undefined,
    cb: (txn: Transaction) => Promise<T>,
  ) => Promise<T>;
  ipAddress: string;
}

export const getOrCreateTransaction = async <T>(
  testTransaction: Transaction | undefined,
  cb: (txn: Transaction) => Promise<T>,
): Promise<T> => {
  if (testTransaction) {
    return cb(await testTransaction);
  } else {
    // When in the subscription server, just create a self-closing transaction
    return transaction(Model.knex(), cb);
  }
};

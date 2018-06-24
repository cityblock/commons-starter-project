import { transaction, Transaction } from 'objection';
import TaskEvent, { ITaskEventOptions } from '../models/task-event';

export async function processTaskEvent(data: ITaskEventOptions, existingTxn?: Transaction) {
  await transaction(existingTxn || TaskEvent.knex(), async txn => {
    await TaskEvent.create(data, txn);
  });
}

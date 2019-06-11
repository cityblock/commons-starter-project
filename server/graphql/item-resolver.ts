import { IRootQueryType } from 'schema';
import Item from '../models/item';
import { IContext } from './shared/utils';

export interface IQuery {
  itemId: string;
}

export async function resolveItem(
  root: any,
  { itemId }: IQuery,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootQueryType['item']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Item.get(itemId, txn);
  });
}

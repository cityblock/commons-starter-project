import { isNil, omitBy } from 'lodash';
import {
  IItemCreateOnRootMutationTypeArguments,
  IItemEditInput,
  IItemEditOnRootMutationTypeArguments,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Item from '../models/item';
import { IContext } from './shared/utils';

export interface IItemQuery {
  itemId: string;
}

export interface IItemDelete {
  itemId: string;
}

export async function resolveItem(
  root: any,
  { itemId }: IItemQuery,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootQueryType['item']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Item.get(itemId, txn);
  });
}

export async function itemCreate(
  root: any,
  { input }: IItemCreateOnRootMutationTypeArguments,
  {  }: IItemQuery,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootMutationType['itemCreate']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Item.create(input, txn);
  });
}

export async function itemEdit(
  root: any,
  { input }: IItemEditOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootMutationType['itemEdit']> {
  const filtered = omitBy<IItemEditInput>(input, isNil) as any;

  return getOrCreateTransaction(testTransaction, async txn => {
    return Item.edit(input.itemId, filtered, txn);
  });
}

export async function itemDelete(
  root: any,
  { itemId }: IItemDelete,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootMutationType['itemDelete']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Item.delete(itemId, txn);
  });
}

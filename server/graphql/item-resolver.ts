import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import {
  IItemCreateOnRootMutationTypeArguments,
  IItemDeleteOnRootMutationTypeArguments,
  IItemEditInput,
  IItemEditOnRootMutationTypeArguments,
  IItemOnRootQueryTypeArguments,
  IRootMutationType,
  IRootQueryType
} from 'schema';
import Item from '../models/item';
import { IContext } from './shared/utils';

export async function getItem(
  _root: {},
  { itemId }: IItemOnRootQueryTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootQueryType['item']> {
  return getOrCreateTransaction(
    testTransaction,
    async txn => Item.get(itemId, txn)
  );
}

export async function itemCreate(
  _root: {},
  { input }: IItemCreateOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootMutationType['itemCreate']> {
  return getOrCreateTransaction(
    testTransaction,
    async txn => Item.create(input, txn)
  );
}

export async function itemEdit(
  _root: {},
  { input: { itemId, ...args } }: IItemEditOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootMutationType['itemEdit']> {
  const filteredArgs = omitBy<IItemEditInput>({ ...args, itemId }, isNil) as any;

  return getOrCreateTransaction(
    testTransaction,
    async txn => Item.edit(itemId, filteredArgs, txn)
  );
}

export async function itemDelete(
  _root: {},
  { input: { itemId } }: IItemDeleteOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext
): Promise<IRootMutationType['itemDelete']> {
  return getOrCreateTransaction(
    testTransaction,
    async txn => Item.delete(itemId, txn)
  );
}

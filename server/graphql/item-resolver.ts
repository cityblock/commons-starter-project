import { transaction } from 'objection';
import {
  ICreateItemOnRootMutationTypeArguments as ICreateItem,
  IEditItemOnRootMutationTypeArguments as IEditItem,
  IRootMutationType,
} from 'schema';
import Item from '../models/item';
import { IContext } from './shared/utils';

export async function getItem(root: {}, args: { itemId: string }, { testTransaction }: IContext) {
  return transaction(testTransaction || Item.knex(), async txn => {
    const oneItem = await Item.get(args.itemId, txn);
    return oneItem;
  });
}

export async function createItem(
  root: {},
  { input }: ICreateItem,
  { testTransaction }: IContext,
): Promise<IRootMutationType['createItem']> {
  return transaction(testTransaction || Item.knex(), async txn => {
    const createdItem = await Item.create({ ...input }, txn);
    return createdItem;
  });
}

export async function editItem(
  root: {},
  { input }: IEditItem,
  { testTransaction }: IContext,
): Promise<IRootMutationType['editItem']> {
  return transaction(testTransaction || Item.knex(), async txn => {
    const editedItem = await Item.edit(input.id, { ...input }, txn);
    return editedItem;
  });
}

export async function deleteItem(
  root: {},
  args: { itemId: string },
  { testTransaction }: IContext,
): Promise<IRootMutationType['deleteItem']> {
  return transaction(testTransaction || Item.knex(), async txn => {
    return Item.delete(args.itemId, txn);
  });
}

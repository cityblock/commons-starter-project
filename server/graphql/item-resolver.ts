import { GraphQLResolveInfo } from 'graphql';
import { Transaction } from 'objection';
import { IRootMutationType, IRootQueryType } from 'schema';
import Item from '../models/item';

export const resolveAllItem = async (
  root: {},
  args: {},
  context: Transaction,
  info: {},
): Promise<IRootQueryType['allItem']> => Item.getAll(context);

export const resolveItem = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues }: GraphQLResolveInfo,
): Promise<IRootQueryType['item']> => Item.get(variableValues.id, context);

export const resolveCreateItem = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues }: any,
): Promise<IRootMutationType['itemCreate']> => {
  const newItem = await Item.create(variableValues, context);
  return newItem;
};

export const resolveEditItem = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues }: any,
): Promise<IRootMutationType['itemEdit']> => Item.edit(variableValues.id, variableValues, context);

export const resolveDeleteItem = async (
  root: {},
  args: {},
  context: Transaction,
  { variableValues: { id } }: any,
): Promise<IRootMutationType['itemDelete']> => {
  const itemToDelete = await Item.delete(id, context);
  return itemToDelete;
};

import { isNil, omitBy } from "lodash";
import { transaction } from "objection";
import {
  ICreateItemOnRootMutationTypeArguments,
  IEditItemOnRootMutationTypeArguments,
  IItemEditInput,
  IItemOnRootQueryTypeArguments,
  IRootMutationType,
  IRootQueryType
} from "schema";
import Item, { IItemInput } from "server/models/item";
import { IContext } from "./shared/utils";

export async function resolveGetItem(
  root: any,
  { itemId }: IItemOnRootQueryTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootQueryType['item']> {
  return transaction(testTransaction || Item.knex(), async txn => {
    return Item.get(itemId, txn);
  });
};

export async function resolveCreateItem(
  root: any,
  { input }: ICreateItemOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['createItem']> {
  return transaction(testTransaction || Item.knex(), async txn => {
    return Item.create(input, txn);
  });
};

export async function resolveEditItem(
  root: any,
  { input }: IEditItemOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['editItem']> {
  return transaction(testTransaction || Item.knex(), async txn => {
    const filtered = omitBy<IItemEditInput>(input, isNil) as Partial<IItemInput>;
    return Item.edit(input.itemId, filtered, txn);
  });
};
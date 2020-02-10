import { transaction } from "objection";
import {
  ICreateItemOnRootMutationTypeArguments,
  IItemOnRootQueryTypeArguments,
  IRootMutationType,
  IRootQueryType
} from "schema";
import Item from "server/models/item";
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
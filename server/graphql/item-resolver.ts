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

// export const resolveEditPokemon = async (
//   root: {},
//   args: {},
//   context: Transaction,
//   // couldn't figure out how to type variable values in the edit case
//   { variableValues }: any,
// ): Promise<IRootMutationType['pokemonEdit']> =>
//   Pokemon.edit(variableValues.id, variableValues, context);

// export const resolveCreatePokemon = async (
//   root: {},
//   args: {},
//   context: Transaction,
//   // couldn't figure out how to type variable values in the create case
//   { variableValues }: any,
// ): Promise<IRootMutationType['pokemonCreate']> => {
//   const newPoke = await Pokemon.create(variableValues, context);
//   return newPoke;
// };

// export const resolveDeletePokemon = async (
//   root: {},
//   args: {},
//   context: Transaction,
//   // couldn't figure out how to type variable values in the create case
//   { variableValues: { id } }: any,
// ): Promise<IRootMutationType['pokemonCreate']> => {
//   const newPoke = await Pokemon.delete(id, context);
//   return newPoke;
// };

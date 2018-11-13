import { Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';

export interface IContext {
  testTransaction?: Transaction;
}

export const resolveAllPokemon = async (
  root: {},
  args: {},
  context: Transaction,
  info: {},
): Promise<IRootQueryType['allPokemon']> => Pokemon.getAll(context);

export const resolvePokemon = async (
  root: {},
  args: {},
  context: Transaction,
  info: any,
): Promise<IRootQueryType['pokemon']> => {
  return Pokemon.get(info.variableValues.pokemonId, context);
};

import { Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';

export interface IContext {
  testTransaction?: Transaction;
}

export const resolvePokemon = async (
  root: {},
  args: {},
  context: Transaction,
  info: {},
): Promise<IRootQueryType['allPokemon']> => Pokemon.getAll(context);

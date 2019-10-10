import { transaction } from 'objection';
import { IRootMutationType, IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

export async function resolveAllPokemon(
  root: any,
  args: any,
  { testTransaction }: IContext,
): Promise<IRootQueryType['getAllPokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
}

export async function resolvePokemonItems(
  root: any,
  args: any,
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemonItems']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.get(args.pokemonId, txn);
  });
}

export async function resolveNewPokemon(
  root: any,
  args: any,
  { testTransaction }: IContext,
): Promise<IRootMutationType['newPokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.create(args.input, txn);
  });
}

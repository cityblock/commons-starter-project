import { transaction } from 'objection';
import { uniqueId, IRootQueryType } from 'schema';
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
  { id }: uniqueId,
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemonItems']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.get(id, txn);
  });
}

import { transaction } from 'objection';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

export async function getAllPokemon(root: any, args: any, { testTransaction }: IContext) {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const allPokemon = await Pokemon.getAll(txn);
    return allPokemon;
  });
}

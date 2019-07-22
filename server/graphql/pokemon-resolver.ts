import { transaction } from 'objection';
import { IPokemonCreateInput } from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

interface IPokemonCreate {
  input: IPokemonCreateInput;
}

export async function getAllPokemon(root: {}, args: {}, { testTransaction }: IContext) {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const allPokemon = await Pokemon.getAll(txn);
    return allPokemon;
  });
}

export async function getOnePokemon(
  root: {},
  args: { pokemonId: string },
  { testTransaction }: IContext,
) {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const onePokemon = await Pokemon.get(args.pokemonId, txn);
    return onePokemon;
  });
}

export async function createAPokemon(
  root: {},
  { input }: IPokemonCreate,
  { testTransaction }: IContext,
) {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const createdPokemon = await Pokemon.create({ ...input }, txn);
    return createdPokemon;
  });
}
